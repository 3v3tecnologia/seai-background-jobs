import { Left, Right } from "../../../../shared/result.js";
import {
  EquipmentMapper,
  mapItemsToPersistency,
} from "../../core/mappers/index.js";
import { EQUIPMENT_TYPE } from "../../core/equipments-types.js";

import { Filter } from "../helpers/filters.js";
import { NotBelongTo } from "../helpers/predicates.js";
import { Logger } from "../../../../shared/logger.js";
export class FetchEquipments {
  // Should be a array of services?
  #fetchEquipmentsFromMeteorologicalEntity;
  #equipmentsApi;

  constructor(fetchEquipmentsFromMeteorologicalEntity, equipmentsApi) {
    this.#fetchEquipmentsFromMeteorologicalEntity =
      fetchEquipmentsFromMeteorologicalEntity;
    this.#equipmentsApi = equipmentsApi;
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

  removeDuplicatedEquipments(
    equipmentsFromMeteorologicalEntity,
    alreadyRecordedEquipments
  ) {
    return {
      station: this.removeDuplicated({
        items: equipmentsFromMeteorologicalEntity.equipments.get(EQUIPMENT_TYPE.STATION),
        toCompare: alreadyRecordedEquipments.get(EQUIPMENT_TYPE.STATION),
      }),
      pluviometer: this.removeDuplicated({
        items: equipmentsFromMeteorologicalEntity.equipments.get(
          EQUIPMENT_TYPE.PLUVIOMETER
        ),
        toCompare: alreadyRecordedEquipments.get(EQUIPMENT_TYPE.PLUVIOMETER),
      }),
    };
  }

  // params : Date to Query
  async execute(command) {
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

    const equipmentsWithoutDuplication = this.removeDuplicatedEquipments(
      equipmentsFromMeteorologicalEntity,
      alreadyRecordedEquipments
    );

    const equipmentsTypesOrError = await this.#equipmentsApi.getTypes();

    if (equipmentsTypesOrError.isError()) {
      return Left.create(equipmentsTypesOrError.error());
    }

    const equipmentsTypes = equipmentsTypesOrError.value();

    const stationsToBePersisted = mapItemsToPersistency(EquipmentMapper)(
      equipmentsWithoutDuplication.station,
      {
        Id_Type: equipmentsTypes.get(EQUIPMENT_TYPE.STATION),
      }
    );

    const pluviometersToBePersisted = mapItemsToPersistency(EquipmentMapper)(
      equipmentsWithoutDuplication.pluviometer,
      {
        Id_Type: equipmentsTypes.get(EQUIPMENT_TYPE.PLUVIOMETER),
      }
    );

    // Maybe delegate to SQL insert **ON CONFLICT** clause using the column CODE
    if (stationsToBePersisted.length) {
      const response = await this.#equipmentsApi.bulkInsert(
        stationsToBePersisted
      );

      if (response.isError()) {
        Left.create(response.error());
      }

      Logger.info({
        msg: `Sucesso ao realizar a inserção das estações`,
      });
    }

    if (pluviometersToBePersisted.length) {
      const response = await this.#equipmentsApi.bulkInsert(
        pluviometersToBePersisted
      );

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
