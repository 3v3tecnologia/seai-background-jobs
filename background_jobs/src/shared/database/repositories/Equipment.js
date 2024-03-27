import { connections } from "../connection.js";

export class MetereologicalEquipmentRepository {
  #connection;

  constructor(connection) {
    this.#connection = connections.equipments;
  }

  async getEquipments({ organName = null, eqpType = "" }) {
    let equipments = [];

    if (organName) {
      equipments = await this.#connection.raw(
        `
        SELECT
          equipment."IdEquipment" AS "Id",
          equipment."IdEquipmentExternal" AS "Code",
          equipment."Name" AS "Location",
          equipment."Altitude",
          eqp_type."Name" AS "Type",
          organ."Name" AS "Organ",
          organ."IdOrgan" AS "Organ_Id"
        FROM
          "MetereologicalEquipment" equipment
        INNER JOIN "EquipmentType" eqp_type ON eqp_type."IdType" = equipment."FK_Type"
        INNER JOIN "MetereologicalOrgan" organ ON organ."IdOrgan" = equipment."FK_Organ"
        WHERE
          organ."Name" = ? AND eqp_type."Name" = ?
        `,
        [organName, eqpType]
      );
    } else {
      equipments = await this.#connection.raw(
        `
        SELECT
          equipment."IdEquipment" AS "Id",
          equipment."IdEquipmentExternal" AS "Code",
          equipment."Name" AS "Location",
          equipment."Altitude",
          eqp_type."Name" AS "Type",
          organ."Name" AS "Organ",
          organ."IdOrgan" AS "Organ_Id"
        FROM
          "MetereologicalEquipment" equipment
        INNER JOIN "EquipmentType" eqp_type ON eqp_type."IdType" = equipment."FK_Type"
        INNER JOIN "MetereologicalOrgan" organ ON organ."IdOrgan" = equipment."FK_Organ"
        WHERE
          eqp_type."Name" = ?
        `,
        [eqpType]
      );
    }

    return equipments.rows.map((eqp) => {
      return {
        Id: eqp.Id,
        Code: eqp.Code,
        Location: eqp.Location,
        Altitude: eqp.Altitude,
        Type: eqp.Type,
        Organ: eqp.Organ,
        Id_Organ: eqp.Organ_Id,
      };
    });
  }

  async getOrganByName(organName) {
    const result = await this.#connection
      .select("IdOrgan", "Host", "User", "Password")
      .from("MetereologicalOrgan")
      .where({ Name: organName })
      .first();

    if (result) {
      return {
        Id_Organ: result.IdOrgan,
        Host: result.Host,
        User: result.User,
        Password: result.Password,
      };
    }

    return null;
  }

  async getTypesId() {
    const type = new Map();

    const result = await this.#connection
      .select("IdType", "Name")
      .from("EquipmentType");

    result.forEach((raw) => {
      type.set(raw.Name, raw.IdType);
    });

    return type;
  }

  async create(equipments = []) {
    const insertedEquipments = new Map();

    await this.#connection.transaction(async (trx) => {
      // TO-DO: how insert coordinates?
      // TO-DO: how measurements?
      const eqps = await trx
        .batchInsert(
          "MetereologicalEquipment",
          equipments.map((equipment) => {
            return {
              IdEquipmentExternal: equipment.IdEquipmentExternal,
              Name: equipment.Name,
              Altitude: equipment.Altitude,
              FK_Organ: equipment.FK_Organ,
              FK_Type: equipment.FK_Type,
              Enabled: equipment.Enabled,
              CreatedAt: this.#connection.fn.now(),
            };
          })
        )
        .returning(["IdEquipment", "IdEquipmentExternal"]);

      // [ { IdEquipment: 1 }, { IdEquipment: 2 } ]
      eqps.forEach((eqp) =>
        insertedEquipments.set(eqp.IdEquipmentExternal, eqp.IdEquipment)
      );
    });

    return insertedEquipments;
  }

  async insertStationsMeasurements(measurements = []) {
    await this.#connection.transaction(async (trx) => {
      await trx.batchInsert(
        "ReadStations",
        measurements.map((measures) => {
          return {
            FK_Equipment: measures.IdEquipment,
            FK_Organ: measures.FK_Organ,
            Time: measures.Time,
            Hour: measures.Hour,
            TotalRadiation: measures.TotalRadiation,
            MaxRelativeHumidity: measures.MaxRelativeHumidity,
            MinRelativeHumidity: measures.MinRelativeHumidity,
            AverageRelativeHumidity: measures.AverageRelativeHumidity,
            MaxAtmosphericTemperature: measures.MaxAtmosphericTemperature,
            MinAtmosphericTemperature: measures.MinAtmosphericTemperature,
            AverageAtmosphericTemperature:
              measures.AverageAtmosphericTemperature,
            AtmosphericPressure: measures.AtmosphericPressure,
            WindVelocity: measures.WindVelocity,
            Et0: measures.Et0,
          };
        })
      );
    });
  }

  async insertPluviometersMeasurements(measurements = []) {
    await this.#connection.transaction(async (trx) => {
      await trx.batchInsert(
        "ReadPluviometers",
        measurements.map((eqp) => {
          return {
            FK_Equipment: eqp.IdEquipment,
            FK_Organ: eqp.FK_Organ,
            Time: eqp.Time,
            Hour: eqp.Hour,
            Value: eqp.Value,
          };
        })
      );
    });
  }
}
