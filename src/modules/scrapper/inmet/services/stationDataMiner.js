import { setTimeout } from "node:timers/promises";

import scrapperConfig from "../../config/scrapper.js";

import { Command } from "../../core/commands/command.js";

export class StationDataMiner extends Command {
  constructor(
    dataMiner,
    metereologicalEquipmentDao,
    stationReadDao,
    pluviometerReadDao
  ) {
    this.dataMiner = dataMiner;
    this.metereologicalEquipmentDao = metereologicalEquipmentDao;
    this.stationReadDao = stationReadDao;
    this.pluviometerReadDao = pluviometerReadDao;
  }

  async execute(params) {
    const equipments =
      await this.metereologicalEquipmentDao.getInmetEquipments();

    if (!equipments.length) {
      this.logs.addWarningLog("Não há equipamentos do INMET cadastradas");
      return;
    }

    const eqpCodes = equipments.map((eqp) => eqp.code);

    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(
        reject,
        scrapperConfig.toleranceTime,
        new Error(
          `Exceeded the tolerance time limit ${scrapperConfig.toleranceTime}`
        )
      );
    });

    const measures = await Promise.race([
      this.dataMiner.getMeasures({
        codes: eqpCodes,
        ...scrapperConfig.params,
      }),
      timeoutPromise,
    ]);

    const pluviometers = equipments.filter(
      (eqp) => eqp.Type.Name === "pluviometer"
    );

    const stations = equipments.filter((eqp) => eqp.Type.Name === "station");

    //TO-DO => Buscar medições de pluviÔmetros vindo de measures
    //TO-DO => Buscar medições de estações vindo de measures

    this.logs.addInfoLog("Sucesso ao obter dados das medições do INMET");

    await this.stationReadDao.create(stations, measures, params.idTimestamp);
  }
}
