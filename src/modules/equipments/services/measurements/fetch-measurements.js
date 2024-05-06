import { Logger } from "../../../../shared/logger.js";
import { Left, Right } from "../../../../shared/result.js";
import { EQUIPMENT_TYPE } from "../../core/equipments-types.js";
import { MeasurementsMapper } from "../../core/mappers/index.js";
import { Filter } from "../helpers/filters.js";
import { BelongTo } from "../helpers/predicates.js";

export class FetchEquipmentsMeasures {
  #fetchEquipmentsFromMeteorologicalEntity;
  #equipmentsApi;

  constructor(fetchEquipmentsFromMeteorologicalEntity, equipmentsApi) {
    this.#fetchEquipmentsFromMeteorologicalEntity =
      fetchEquipmentsFromMeteorologicalEntity;
    this.#equipmentsApi = equipmentsApi;
  }

  getOnlyRecordedEquipments({ items, alreadyRecorded }) {
    const filterByCodes = new Filter({
      items,
      predicate: new BelongTo(alreadyRecorded),
    });

    return filterByCodes.exec();
  }

  // OBS: Sempre irá tentar buscar dados de medições do dia anterior a data informada
  async execute(command) {
    Logger.info({
      msg: `Iniciando busca de dados pelo FTP da FUNCEME pela data ${command.getDate()}`,
    });

    const alreadyRecordedEquipmentsOrError =
      await this.#equipmentsApi.getEquipmentsByTypes();

    if (alreadyRecordedEquipmentsOrError.isError()) {
      return Left.create(alreadyRecordedEquipmentsOrError.error());
    }

    const alreadyRecordedEquipments = alreadyRecordedEquipmentsOrError.value();

    // stations and pluviometers from Funceme
    const equipmentsFromMeteorologicalEntityOrError =
      await this.#fetchEquipmentsFromMeteorologicalEntity.execute(command);

    if (equipmentsFromMeteorologicalEntityOrError.isError()) {
      return Left.create(equipmentsFromMeteorologicalEntityOrError.error());
    }

    // new measurements from FUNCEME
    const equipmentsFromMeteorologicalEntity =
      equipmentsFromMeteorologicalEntityOrError.value();

    const stations = this.getOnlyRecordedEquipments({
      items: equipmentsFromMeteorologicalEntity.get(EQUIPMENT_TYPE.STATION),
      alreadyRecorded: alreadyRecordedEquipments.get(EQUIPMENT_TYPE.STATION),
    });

    const pluviometers = this.getOnlyRecordedEquipments({
      items: equipmentsFromMeteorologicalEntity.get(EQUIPMENT_TYPE.PLUVIOMETER),
      alreadyRecorded: alreadyRecordedEquipments.get(
        EQUIPMENT_TYPE.PLUVIOMETER
      ),
    });

    const stationsMeasurements = MeasurementsMapper.ToPersistency(
      stations,
      alreadyRecordedEquipments.get(EQUIPMENT_TYPE.STATION)
    );

    const pluviometersMeasurements = MeasurementsMapper.ToPersistency(
      pluviometers,
      alreadyRecordedEquipments.get(EQUIPMENT_TYPE.PLUVIOMETER)
    );

    const toBulkInsertPromises = [];

    if (stationsMeasurements.length) {
      toBulkInsertPromises.push(
        this.#equipmentsApi.bulkInsertMeasurements(
          EQUIPMENT_TYPE.STATION,
          stationsMeasurements
        )
      );
    }

    if (pluviometersMeasurements.length) {
      toBulkInsertPromises.push(
        this.#equipmentsApi.bulkInsertMeasurements(
          EQUIPMENT_TYPE.PLUVIOMETER,
          pluviometersMeasurements
        )
      );
    }

    if (toBulkInsertPromises.length) {
      const bulkInsertResult = await Promise.all(toBulkInsertPromises);

      bulkInsertResult.forEach((result) => {
        if (result.isError()) {
          Logger.error({
            msg: result.error().message,
          });

          return;
        }
      });

      return Right.create("Sucesso ao salvar medições de equipamentos");
    }

    return Right.create(
      "Nenhuma operação de escrita de medições foi realizada"
    );
  }
}
