
import {
  EquipmentMapper,
  mapItemsToPersistency,
} from "../core/mappers/index.js";
import { EQUIPMENT_TYPE } from "../core/equipments-types.js";

import { Filter } from "../helpers/filters.js";
import { NotBelongTo } from "../helpers/predicates.js";
import { EquipmentCommand } from './commands/command.js'
import { Logger } from "../../shared/logger.js";
import { Left, Right } from "../../shared/result.js";

export class FetchEquipments {
  // Should be a array of services?
  #fetchEquipmentsFromMeteorologicalEntity;
  #equipmentsApi;
  #geolocationProvider;

  constructor(
    fetchEquipmentsFromMeteorologicalEntity,
    equipmentsApi,
    geolocationProvider
  ) {
    this.#fetchEquipmentsFromMeteorologicalEntity =
      fetchEquipmentsFromMeteorologicalEntity;
    this.#equipmentsApi = equipmentsApi;
    this.#geolocationProvider = geolocationProvider;
  }

  removeDuplicated({ items, toCompare }) {
    if (toCompare.size) {
      const removeDuplicatedFilter = new Filter({
        items,
        predicate: new NotBelongTo(toCompare),
      });

      return removeDuplicatedFilter.exec();
    }

    return items;
  }

  withoutInvalidEquipments(
    equipmentsFromMeteorologicalEntity,
    alreadyRecordedEquipments
  ) {
    const stations = this.removeDuplicated({
      items: equipmentsFromMeteorologicalEntity.equipments.get(
        EQUIPMENT_TYPE.STATION
      ),
      toCompare: alreadyRecordedEquipments.get(EQUIPMENT_TYPE.STATION),
    });

    const pluviometers = this.removeDuplicated({
      items: equipmentsFromMeteorologicalEntity.equipments.get(
        EQUIPMENT_TYPE.PLUVIOMETER
      ),
      toCompare: alreadyRecordedEquipments.get(EQUIPMENT_TYPE.PLUVIOMETER),
    });

    return {
      station: this.removeEquipmentsWithInvalidCoordinates(stations),
      pluviometer: this.removeEquipmentsWithInvalidCoordinates(pluviometers),
    };
  }

  removeEquipmentsWithInvalidCoordinates(equipments) {
    return equipments.filter((eqp) => {
      const { Latitude, Longitude } = eqp.Location;

      return this.#geolocationProvider.isPointInsideThePolygon(
        Longitude,
        Latitude
      );
    });
  }

  // params : Date to Query
  async execute(command = new EquipmentCommand()) {
    const equipmentsFromMeteorologicalEntityOrError =
      await this.#fetchEquipmentsFromMeteorologicalEntity.execute(command);

    if (equipmentsFromMeteorologicalEntityOrError.isError()) {
      return Left.create(equipmentsFromMeteorologicalEntityOrError.error());
    }

    // Map<'station'|'pluviometer',Array>
    const equipmentsFromMeteorologicalEntity =
      equipmentsFromMeteorologicalEntityOrError.value();


    // Replace it to one query
    const alreadyRecordedEquipmentsOrError =
      await this.#equipmentsApi.getEquipmentsByTypes();

    if (alreadyRecordedEquipmentsOrError.isError()) {
      return Left.create(alreadyRecordedEquipmentsOrError.error());
    }

    // Map<'station'|'pluviometer',Map<code,Array>>
    const alreadyRecordedEquipments = alreadyRecordedEquipmentsOrError.value();

    const equipments = this.withoutInvalidEquipments(
      equipmentsFromMeteorologicalEntity,
      alreadyRecordedEquipments
    );

    const equipmentsTypesOrError = await this.#equipmentsApi.getTypes();

    if (equipmentsTypesOrError.isError()) {
      return Left.create(equipmentsTypesOrError.error());
    }

    const equipmentsTypes = equipmentsTypesOrError.value();

    const stationsToBePersisted = mapItemsToPersistency(EquipmentMapper)(
      equipments.station,
      {
        Id_Type: equipmentsTypes.get(EQUIPMENT_TYPE.STATION),
      }
    );

    const pluviometersToBePersisted = mapItemsToPersistency(EquipmentMapper)(
      equipments.pluviometer,
      {
        Id_Type: equipmentsTypes.get(EQUIPMENT_TYPE.PLUVIOMETER),
      }
    );

    // Maybe delegate to SQL insert **ON CONFLICT** clause using the column CODE
    if (stationsToBePersisted.length) {
      const response = await this.#equipmentsApi.bulkInsert({
        items: stationsToBePersisted,
        id_organ: equipmentsFromMeteorologicalEntity.organId,
      });

      if (response.isError()) {
        Left.create(response.error());
      }

      Logger.info({
        msg: `Sucesso ao realizar a inserção das estações`,
      });
    }

    if (pluviometersToBePersisted.length) {
      const response = await this.#equipmentsApi.bulkInsert({
        items: pluviometersToBePersisted,
        id_organ: equipmentsFromMeteorologicalEntity.organId,
      });

      if (response.isError()) {
        Left.create(response.error());
      }

      Logger.info({
        msg: `Sucesso ao realizar a inserção das pluviômetros`,
      });
    }

    return Right.create("Sucesso ao carregar equipamentos");
  }
}
