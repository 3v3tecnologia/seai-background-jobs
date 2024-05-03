import { Left, Right } from "../../../../shared/result.js";
import { StationMapper, PluviometerMapper } from "../../core/mappers/index.js";
import { EQUIPMENT_TYPE } from "../../core/equipments-types.js";

export class FetchEquipments {
  // Should be a array of services?
  #fetchEquipmentsService;
  #equipmentsServices;

  constructor(fetchEquipmentsService, equipmentsServices) {
    this.#fetchEquipmentsService = fetchEquipmentsService;
    this.#equipmentsServices = equipmentsServices;
  }

  // params : Date to Query
  async execute(command) {
    // stations and pluviometers
    const equipmentsOrError = await this.#fetchEquipmentsService.execute(
      command
    );

    if (equipmentsOrError.isError()) {
      return Left.create(equipmentsOrError.error().message);
    }

    const { stations, pluviometers } = equipmentsOrError.value();

    // Replace it to one query
    const existingEquipmentsOrError =
      await this.#equipmentsServices.getCodesByTypes();

    if (existingEquipmentsOrError.isError()) {
      return Left.create(existingEquipmentsOrError.error().message);
    }

    const [existingStations, existingPluviometers] =
      existingEquipmentsOrError.value();

    // Maybe delegate to SQL insert ON duplicated using the column CODE
    const existingEquipmentsCodes = new Set();

    if (existingStations.length) {
      existingStations.forEach((eqp) => existingEquipmentsCodes.add(eqp.Code));
    }

    if (existingPluviometers.length) {
      existingPluviometers.forEach((eqp) =>
        existingEquipmentsCodes.add(eqp.Code)
      );
    }

    const equipmentsTypesOrError = await this.#equipmentsServices.getTypes();

    if (equipmentsTypesOrError.isError()) {
      return Left.create(equipmentsTypesOrError.error().message);
    }

    const equipmentsTypes = equipmentsTypesOrError.value();

    const stationsToBePersisted = mapEquipmentsToPersistency(
      existingEquipmentsCodes,
      stations,
      equipmentsTypes.get(EQUIPMENT_TYPE.STATION),
      StationMapper.toPersistency
    );

    const pluviometersToBePersisted = mapEquipmentsToPersistency(
      existingEquipmentsCodes,
      pluviometers,
      equipmentsTypes.get(EQUIPMENT_TYPE.PLUVIOMETER),
      PluviometerMapper.toPersistency
    );

    // Remove it and replace to one query
    if (stationsToBePersisted.length) {
      await this.#equipmentsServices.bulkInsert(stationsToBePersisted);
    }

    if (pluviometersToBePersisted.length) {
      await this.#equipmentsServices.bulkInsert(pluviometersToBePersisted);
    }

    return Right.create("Sucesso ao carregar equipamentos");
  }
}

function mapEquipmentsToPersistency(
  oldEquipments,
  newEquipments,
  idType,
  mapper
) {
  const toPersist = [];
  newEquipments.forEach((station) => {
    if (oldEquipments.has(station.Code)) {
      return;
    }

    Object.assign(station, {
      FK_Type: idType,
    });

    toPersist.push(mapper(station));
  });

  return toPersist;
}
