import { SEAI_BASE_URL } from "../../../../shared/config/seaiApi.js";
import { Logger } from "../../../../shared/logger.js";
import { Left, Right } from "../../../../shared/result.js";

export class EquipmentsServices {
  #baseUrl;

  constructor() {
    this.#baseUrl = SEAI_BASE_URL + "/api/v2/equipments";
  }

  async getMeteorologicalOrganCredentials(organName) {
    try {
      const { data } = await (
        await fetch(
          `${
            this.#baseUrl
          }/meteorological_organ/access_credentials?organName=${organName}`
        )
      ).json();

      if (data) {
        const { Id, Host, User, Password } = data;

        return {
          Id,
          Host,
          User,
          Password,
        };
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async bulkInsert(data = []) {
    try {
      const response = await fetch(this.#baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type
        },
        body: JSON.stringify({
          items: data,
        }),
      });

      console.log("RESPONSE ", response);

      if (response.status >= 400 && response.status <= 500) {
        Logger.error({
          msg: "Falha ao tentar atualizar leituras",
        });

        return Left.create(new Error(response.error));
      }

      const result = await response.json();

      return Right.create(result.data);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }

  async getEquipmentsByTypes(types = ["station", "pluviometer"]) {
    try {
      const organizedByTypes = new Map();

      for (const type of types) {
        const organizedByCodes = new Map();

        const { data } = await (
          await fetch(`${this.#baseUrl}?type=${type}`)
        ).json();

        if (data) {
          Logger.info({
            msg: `Sucesso ao obter medições de ${type}`,
          });

          data.forEach((item) => {
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
        }

        organizedByTypes.set(type, organizedByCodes);
      }

      if (
        [
          organizedByTypes.get("station").size,
          organizedByTypes.get("pluviometer").size,
        ].every((cond) => cond === 0)
      ) {
        return Left.create(new Error("Não há equipamentos cadastrados"));
      }

      return Right.create(organizedByTypes);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }

  async getTypes() {
    try {
      const { data } = await (await fetch(`${this.#baseUrl}/types`)).json();

      const types = new Map();

      data.forEach((item) => {
        types.set(item.Name, item.Type);
      });

      if (types.size === 0) {
        return Left.create(
          new Error("Não foi possível encontrar tipos de equipamentos")
        );
      }

      return Right.create(types);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }

  async bulkInsertMeasurements(type, measurements) {
    console.log({ type, measurements });
    try {
      const response = await fetch(`${this.#baseUrl}/measurements`, {
        headers: {
          "Content-Type": "application/json", // Set the content type
        },
        method: "POST",
        body: JSON.stringify({
          type,
          items: measurements,
        }),
      });

      if (response.status >= 400 && response.status <= 500) {
        Logger.error({
          msg: "Falha ao tentar atualizar leituras",
        });

        return Left.create(new Error(response.error));
      }

      const result = await response.json();

      const ids = result.data.map((item) => item.IdRead);

      Logger.info({
        msg: `Sucesso ao salva leituras de ${type}`,
      });

      return Right.create(ids);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }
}