import { Logger } from "../../../../shared/logger.js";
import { Left, Right } from "../../../../shared/result.js";
import { PluviometerMapper, StationMapper } from "../../core/mappers/index.js";
import { EQUIPMENT_TYPE } from "../../core/equipments-types.js";

export class FetchEquipmentsMeasures {
  #fetchEquipmentsService;
  #equipmentsServices;
  #calcEt0;

  constructor(fetchEquipmentsService, equipmentsServices, calcEt0) {
    this.#fetchEquipmentsService = fetchEquipmentsService;
    this.#equipmentsServices = equipmentsServices;
    this.#calcEt0 = calcEt0;
  }

  // OBS: Sempre irá tentar buscar dados de medições do dia anterior a data informada
  async execute(command) {
    Logger.info({
      msg: `Iniciando busca de dados pelo FTP da FUNCEME pela data ${command.getDate()}`,
    });

    // Why not fetch all equipments?
    const existingEquipmentsCodesOrError =
      await this.#equipmentsServices.getCodesByTypes();

    if (existingEquipmentsCodesOrError.isError()) {
      return Left.create(existingEquipmentsCodesOrError.error().message);
    }

    const existingStationsCodes = new Map();
    const existingPluviometersCodes = new Map();

    const [existingStations, existingPluviometers] =
      existingEquipmentsCodesOrError.value();

    existingStations.forEach((eqp) => stationsCodes.set(eqp.Code, eqp.Id));

    existingPluviometers.forEach((eqp) =>
      pluviometersCodes.set(eqp.Code, eqp.Id)
    );

    // stations and pluviometers
    const equipmentsOrError = await this.#fetchEquipmentsService.execute(
      command
    );

    if (equipmentsOrError.isError()) {
      return Left.create(equipmentsOrError.error().message);
    }

    const { stations, pluviometers } = equipmentsOrError.value();

    const [
      oldStationsCodesWithMeasurements,
      oldPluviometersCodesWithMeasurements,
    ] = await Promise.all([
      this.#equipmentsServices.getEquipmentsWithMeasurements(
        [...existingStationsCodes.keys()],
        command.getDate(),
        EQUIPMENT_TYPE.STATION
      ),
      this.#equipmentsServices.getEquipmentsWithMeasurements(
        [...existingPluviometersCodes.keys()],
        command.getDate(),
        EQUIPMENT_TYPE.PLUVIOMETER
      ),
    ]);

    const stationsToUpdate = [];
    const stationsToInsert = [];

    stations.forEach((station) => {
      const measurementsAlreadyExists = oldStationsCodesWithMeasurements.has(
        station.Code
      );

      // add to update
      if (measurementsAlreadyExists) {
        stationsToUpdate.push(station);
        return;
      }

      //add to insert
      stationsToInsert.push(station);
    });

    const pluviometersToUpdate = [];
    const pluviometersToInsert = [];

    pluviometers.forEach((pluviometer) => {
      const measurementsAlreadyExists =
        oldPluviometersCodesWithMeasurements.has(pluviometer.Code);

      if (measurementsAlreadyExists) {
        pluviometersToUpdate.push(pluviometer);

        return;
      }

      pluviometersToInsert.push(pluviometer);
    });

    // Is here?
    const equipmentsTypesOrError = await this.#equipmentsServices.getTypes();

    if (equipmentsTypesOrError.isError()) {
      return Left.create(equipmentsTypesOrError.error().message);
    }

    const equipmentsTypes = equipmentsTypesOrError.value();

    // Measurements IDs needed to calculate ET0
    let stationsMeasurementsToCalculateEt0 = [];

    if (stationsToUpdate.length) {
      const stationsToBePersisted = mapEquipmentsToPersistency(
        existingStationsCodes,
        stationsToUpdate,
        equipmentsTypes.get(EQUIPMENT_TYPE.STATION),
        StationMapper.toPersistency,
        command.getDate()
      );

      if (stationsToBePersisted.length) {
        const idsOrError =
          await this.#equipmentsServices.bulkUpdateMeasurements(
            EQUIPMENT_TYPE.STATION,
            stationsToBePersisted
          );

        if (idsOrError.isError()) {
          return Left.create(idsOrError.error().message);
        }

        stationsMeasurementsToCalculateEt0 =
          stationsMeasurementsToCalculateEt0.concat(...idsOrError.value());
      }
    }

    if (pluviometersToUpdate.length) {
      const pluviometersToBePersisted = mapEquipmentsToPersistency(
        existingPluviometersCodes,
        pluviometersToUpdate,
        equipmentsTypes.get(EQUIPMENT_TYPE.PLUVIOMETER),
        PluviometerMapper.toPersistency,
        command.getDate()
      );

      if (pluviometersToBePersisted.length) {
        await this.#equipmentsServices.bulkUpdateMeasurements(
          EQUIPMENT_TYPE.PLUVIOMETER,
          pluviometersToBePersisted
        );
      }
    }

    const stationsToBePersisted = mapEquipmentsToPersistency(
      existingStationsCodes,
      stationsToInsert,
      equipmentsTypes.get(EQUIPMENT_TYPE.STATION),
      StationMapper.toPersistency,
      command.getDate()
    );

    // Remove it and replace to one query
    if (stationsToBePersisted.length) {
      const idsOrError = await this.#equipmentsServices.bulkInsertMeasurements(
        EQUIPMENT_TYPE.STATION,
        stationsToBePersisted
      );

      if (idsOrError.isError()) {
        return Left.create(idsOrError.error().message);
      }

      stationsMeasurementsToCalculateEt0 =
        stationsMeasurementsToCalculateEt0.concat(...idsOrError.value());
    }

    console.log(stationsMeasurementsToCalculateEt0);

    const pluviometersToBePersisted = mapEquipmentsToPersistency(
      existingPluviometersCodes,
      pluviometersToInsert,
      equipmentsTypes.get(EQUIPMENT_TYPE.PLUVIOMETER),
      PluviometerMapper.toPersistency,
      command.getDate()
    );

    if (pluviometersToBePersisted.length) {
      await await this.#equipmentsServices.bulkInsertMeasurements(
        EQUIPMENT_TYPE.PLUVIOMETER,
        pluviometersToBePersisted
      );
    }

    const calcEt0OrError = await this.#calcEt0.execute(
      stationsMeasurementsToCalculateEt0
    );

    if (calcEt0OrError.isError()) {
      return Left.create(calcEt0OrError.error().message);
    }

    return Right.create("Sucesso ao salvar medições de equipamentos");
  }
}

// Optimize
function mapEquipmentsToPersistency(
  oldEquipments, //db
  newEquipments, // ftp
  idType,
  mapper,
  date
) {
  const toPersist = [];
  newEquipments.forEach((station) => {
    if (oldEquipments.has(station.Code) === false) {
      return;
    }

    Object.assign(station, {
      FK_Type: idType,
    });

    toPersist.push(mapper(station, date));
  });

  return prepareMeasurementsToPersist(toPersist, oldEquipments);
}

// Optimize
function prepareMeasurementsToPersist(equipments = [], ids) {
  const measures = [];

  equipments.forEach((station) => {
    if (ids.has(station.IdEquipmentExternal)) {
      station.Measurements.FK_Equipment = ids.get(station.IdEquipmentExternal);
      station.Measurements.FK_Organ = station.FK_Organ;
      measures.push(station.Measurements);
    }
  });

  return measures;
}
