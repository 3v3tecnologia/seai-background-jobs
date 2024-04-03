import { Logger } from "../../../../shared/logger.js";
import { Left, Right } from "../../../../shared/result.js";
import { PluviometerMapper, StationMapper } from "../../core/mappers/index.js";
import { CalcEto } from "../../core/et0";

export class FetchEquipmentsMeasures {
  #fetchEquipmentsService;
  #equipmentRepository;

  constructor(fetchEquipmentsService, equipmentRepository, calcETO) {
    this.#fetchEquipmentsService = fetchEquipmentsService;
    this.#equipmentRepository = equipmentRepository;
  }

  // OBS: Sempre irá tentar buscar dados de medições do dia anterior a data informada
  async execute(command) {
    Logger.info({
      msg: `Iniciando busca de dados pelo FTP da FUNCEME pela data ${command.getDate()}`,
    });

    // Why not fetch all equipments?
    const [existingStations, existingPluviometers] = await Promise.all([
      this.#equipmentRepository.getEquipments({
        eqpType: "station",
      }),
      this.#equipmentRepository.getEquipments({
        eqpType: "pluviometer",
      }),
    ]);

    if (
      [existingStations.length, existingPluviometers.length].every(
        (cond) => cond === 0
      )
    ) {
      return Left.create(new Error("Não há equipamentos cadastrados"));
    }

    const existingEquipmentsCodes = new Map();

    if (existingStations.length) {
      existingStations.forEach((eqp) =>
        existingEquipmentsCodes.set(eqp.Code, eqp.Id)
      );
    }

    if (existingPluviometers.length) {
      existingPluviometers.forEach((eqp) =>
        existingEquipmentsCodes.set(eqp.Code, eqp.Id)
      );
    }

    // stations and pluviometers
    const equipmentsOrError = await this.#fetchEquipmentsService.execute(
      command
    );

    if (equipmentsOrError.isError()) {
      return Left.create(equipmentsOrError.error().message);
    }

    const { stations, pluviometers } = equipmentsOrError.value();

    stations.forEach((station) => {
      // Is here or delegate to other services?
      if (Reflect.has(station.Measurements, "Et0") === false) {
        const {
          AverageAtmosphericTemperature,
          MinAtmosphericTemperature,
          MaxAtmosphericTemperature,
          AverageRelativeHumidity,
          MaxRelativeHumidity,
          MinRelativeHumidity,
          AtmosphericPressure,
          TotalRadiation,
          WindVelocity,
        } = station.Measurements;

        const et0 = CalcEto({
          date: command.getYesterdayDate(),
          measures: {
            altitude: station?.Altitude || null,
            longitude: station?.Longitude || null,
            latitude: station?.Latitude || null,
            averageAtmosphericTemperature: AverageAtmosphericTemperature,
            minAtmosphericTemperature: MinAtmosphericTemperature,
            maxAtmosphericTemperature: MaxAtmosphericTemperature,
            averageRelativeHumidity: AverageRelativeHumidity,
            maxRelativeHumidity: MaxRelativeHumidity,
            minRelativeHumidity: MinRelativeHumidity,
            atmosphericPressure: AtmosphericPressure,
            totalRadiation: TotalRadiation,
            windVelocity: WindVelocity,
          },
        });

        station.Measurements.Et0 = et0;
      }
    });

    // Is here?
    const equipmentsTypes = await this.#equipmentRepository.getTypes();

    const stationsToBePersisted = mapEquipmentsToPersistency(
      existingEquipmentsCodes,
      stations,
      equipmentsTypes.get("station"),
      StationMapper.toPersistency,
      command.getDate()
    );

    const pluviometersToBePersisted = mapEquipmentsToPersistency(
      existingEquipmentsCodes,
      pluviometers,
      equipmentsTypes.get("pluviometer"),
      PluviometerMapper.toPersistency,
      command.getDate()
    );

    // Remove it and replace to one query
    if (stationsToBePersisted.length) {
      await this.#equipmentRepository.insertStationsMeasurements(
        stationsToBePersisted
      );
    }

    if (pluviometersToBePersisted.length) {
      await this.#equipmentRepository.insertPluviometersMeasurements(
        pluviometersToBePersisted
      );
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
