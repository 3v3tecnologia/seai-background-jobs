import { Left, Right } from "../../../../../../shared/result.js";

export class EquipmentsServicesFaker {
  equipmentList = [];
  stationsMeasurementsList = [];
  pluviometersMeasurementsList = [];
  organsList = [
    {
      Id: 1,
      Name: "FUNCEME",
      Host: "testr",
      User: "test",
      Password: "test",
    },
  ];

  async getMeteorologicalOrganCredentials(organName) {
    const organ = this.organsList.find((organ) => organ.Name === organName);
    return organ
      ? {
          Id: organ.Id,
          Host: organ.Host,
          User: organ.User,
          Password: organ.Password,
        }
      : null;
  }

  async bulkInsert(data = []) {
    const insertedEquipments = new Map();

    for (const item of data) {
      const id = new Date().getTime();
      item.IdEquipment = id;

      this.equipmentList.push(item);

      insertedEquipments.set(item.IdEquipmentExternal, id);
    }

    return insertedEquipments;
  }

  async getCodesByTypes(types = ["station", "pluviometer"]) {
    const allTypesOrError = await this.getTypes();

    if (allTypesOrError.isError()) {
      return Left.create(new Error("Não há tipos de equipamentos cadastrados"));
    }

    const allTypes = allTypesOrError.value();

    let equipments = [];

    equipments = types.map((eqpType) => {
      const idType = allTypes.get(eqpType);
      const list = this.equipmentList.filter((eqp) => eqp.Type == idType);

      return list.map((eqp) => {
        return {
          Id: eqp.Id,
          Code: eqp.Code,
          Name: eqp.Name,
          Location: eqp.Location,
          Altitude: eqp.Altitude,
          Type: eqp.Type,
          Organ: eqp.Organ,
          Id_Organ: eqp.Organ_Id,
        };
      });
    });

    if (
      [equipments[0].length, equipments[1].length].every((cond) => cond === 0)
    ) {
      return Left.create(new Error("Não há equipamentos cadastrados"));
    }

    return Right.create(equipments);
  }

  async getEquipmentsWithMeasurements(codes = [], date, type) {
    const eqps = this.equipmentList.filter((eqp) => codes.includes(eqp.Code));

    const makeFilter = (equipments) => {
      return (measurements, date) => {
        const codes = new Set();

        measurements.forEach((item) => {
          const eqp = equipments.find((eqp) => eqp.Id === item.FK_Equipment);

          if (item.Time === date && !!eqp) {
            codes.add(eqp.Code);
          }
        });

        return codes;
      };
    };

    const filterMeasurements = makeFilter(eqps);

    switch (type) {
      case "station":
        return filterMeasurements(this.stationsMeasurementsList, date);
      case "pluviometer":
        return filterMeasurements(this.pluviometersMeasurementsList, date);
      default:
        return new Set();
    }
  }

  async getTypes() {
    const types = new Map([
      ["station", 1],
      ["pluviometer", 2],
    ]);

    return Right.create(types);
  }

  async bulkInsertMeasurements(type, measurements) {
    measurements.forEach((item) => (item.IdRead = Date.now()));
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

    const ids = measurements.map((item) => item.IdRead);

    return Right.create(ids);
  }

  async bulkUpdateMeasurements(type, measurements) {
    return Right.create([]);
  }
}
