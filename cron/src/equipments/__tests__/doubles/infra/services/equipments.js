import { Left, Right } from "../../../../../../shared/result.js";

export class EquipmentsServicesFaker {
  equipmentList = [];
  stationsMeasurementsList = [];
  pluviometersMeasurementsList = [];
  organsList = [];

  constructor(
    {
      equipmentList,
      stationsMeasurements,
      pluviometersMeasurements,
      meteorologicalOrgans,
    } = {
        equipmentList: null,
        stationsMeasurements: null,
        pluviometersMeasurements: null,
        meteorologicalOrgans: null,
      }
  ) {
    this.equipmentList = equipmentList ? equipmentList : [];
    this.stationsMeasurementsList = stationsMeasurements
      ? stationsMeasurements
      : [];
    this.pluviometersMeasurementsList = pluviometersMeasurements
      ? pluviometersMeasurements
      : [];
    this.organsList = meteorologicalOrgans
      ? meteorologicalOrgans
      : [
        {
          Id: 1,
          Name: "FUNCEME"
        },
      ];
  }

  async getMeteorologicalOrganIdentifier(organName) {
    const organ = this.organsList.find((organ) => organ.Name === organName);
    return organ
      ? {
        Id: organ.Id
      }
      : null;
  }

  async bulkInsert({ items, id_organ }) {
    const insertedEquipments = new Map();

    for (const item of items) {
      const id = new Date().getTime();
      item.IdEquipment = id;

      this.equipmentList.push(item);

      insertedEquipments.set(item.IdEquipmentExternal, id);
    }

    return Right.create(insertedEquipments);
  }

  // Why not fetch all equipments?
  async getEquipmentsByTypes(types = ["station", "pluviometer"]) {
    const allTypesOrError = await this.getTypes();

    if (allTypesOrError.isError()) {
      return Left.create(new Error("Não há tipos de equipamentos cadastrados"));
    }

    const allTypes = allTypesOrError.value();

    const organizedByTypes = new Map();

    types.forEach((eqpType) => {
      const idType = allTypes.get(eqpType);

      const organizedByCodes = new Map();

      const sanitizedItems = this.equipmentList
        .filter((eqp) => eqp.Type == idType)
        .map((eqp) => {
          return {
            Id: eqp.Id,
            Code: eqp.Code,
            Name: eqp.Name,
            Location: eqp.Location,
            Altitude: eqp.Altitude,
            Type: eqp.Type,
            Organ: eqp.Organ,
            Id_Organ: eqp.Id_Organ,
          };
        });

      sanitizedItems.forEach((item) => {
        organizedByCodes.set(item.Code, {
          Id: item.Id,
          Name: item.Name,
          Location: item.Location,
          Altitude: item.Altitude,
          Type: item.Type,
          Organ: item.Organ,
          Id_Organ: item.Id_Organ,
        });
      });

      organizedByTypes.set(eqpType, organizedByCodes);
    });

    // if (
    //   [
    //     organizedByTypes.get("station").size,
    //     organizedByTypes.get("pluviometer").size,
    //   ].every((cond) => cond === 0)
    // ) {
    //   return Left.create(new Error("Não há equipamentos cadastrados"));
    // }

    return Right.create(organizedByTypes);
  }

  // list all equipments codes whose measurements already exist
  // Filtrar equipamentos cadastrados listando somente os que já possuem leituras de hoje
  async getEquipmentsCodesWithAlreadyRegisteredMeasurements({
    equipments,
    date,
  }) {
    const eqpsTypes = equipmentsMap.keys();

    const makeFilter = (equipments) => {
      return (equipmentsMeasurements, date) => {
        const equipmentsWithAlreadyRegisteredMeasurements = new Set();

        equipmentsMeasurements.forEach((measurements) => {
          const eqp = equipments.find(
            (eqp) => eqp.Id === measurements.FK_Equipment
          );

          if (measurements.Time === date && !!eqp) {
            equipmentsWithAlreadyRegisteredMeasurements.add(eqp.Code);
          }
        });

        return equipmentsWithAlreadyRegisteredMeasurements;
      };
    };

    // Map<stationType,Set<string>>
    const equipmentsCodesMap = new Map();

    for (const equipmentType of eqpsTypes) {
      const codes = equipments.get(equipmentType).keys();

      const item = this.equipmentList.filter((eqp) => codes.includes(eqp.Code));

      const getEquipmentsCodes = makeFilter(item);

      switch (type) {
        case "station":
          equipmentsCodesMap.set(
            "station",
            getEquipmentsCodes(this.stationsMeasurementsList, date)
          );
          break;
        case "pluviometer":
          equipmentsCodesMap.set(
            "pluviometer",
            getEquipmentsCodes(this.pluviometersMeasurementsList, date)
          );
          break;
        // default:
        //   return new Set();
      }
    }

    return equipmentsCodesMap;
  }

  async getTypes() {
    const types = new Map([
      ["station", 1],
      ["pluviometer", 2],
    ]);

    return Right.create(types);
  }

  async bulkInsertMeasurements(type, measurements) {
    switch (type) {
      case "station":
        this.stationsMeasurementsList = [
          ...measurements,
          ...this.stationsMeasurementsList,
        ];
        break;
      case "pluviometer":
        this.pluviometersMeasurementsList = [
          ...measurements,
          ...this.pluviometersMeasurementsList,
        ];
        break;

      default:
        return Left.create(new Error("Tipo de equipamento não encontrado"));
    }
    const ids = measurements.map((_) => Date.now());

    return Right.create(ids);
  }
}
