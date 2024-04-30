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

      return Right.create(data);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }
  async bulkInsert(data = []) {
    try {
      const response = await (
        await fetch(this.#baseUrl, {
          method: "POST",
          body: JSON.stringify({
            items: data,
          }),
        })
      ).json();

      if (response.status >= 400 && response.status <= 500) {
        Logger.error({
          msg: "Falha ao tentar atualizar leituras",
        });

        return Left.create(new Error(response.error));
      }

      return Right.create(response.data);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }

  async getCodesByTypes(types = ["station", "pluviometer"]) {
    try {
      const equipments = {
        station: [],
        pluviometer: [],
      };

      for (const type of types) {
        const response = await (
          await fetch(`${this.#baseUrl}?type=${type}`)
        ).json();

        if (response.data) {
          Logger.info({
            msg: `Sucesso ao obter medições de ${type}`,
          });

          equipments[type] = response.data;
        }
      }

      if (
        [equipments.station.length, equipments.pluviometer.length].every(
          (cond) => cond === 0
        )
      ) {
        return Left.create(new Error("Não há equipamentos cadastrados"));
      }

      return Right.create([equipments.station, equipments.pluviometer]);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }
  async getEquipmentsWithMeasurements(codes = [], date, type) {
    const resultSet = new Set();
    try {
      const response = await (
        await fetch(`${this.#baseUrl}/measurements`, {
          method: "GET",
          body: JSON.stringify({
            type,
            codes,
            date,
          }),
        })
      ).json();

      if (response.data) {
        Logger.info({
          msg: `Sucesso ao obter códigos de leituras ${type}`,
        });

        const codes = response.data;

        codes.forEach((code) => {
          resultSet.add(code);
        });
      }
    } catch (error) {
      console.log(error);
    }
    return resultSet;
  }
  async getTypes() {
    try {
      const { data } = await (await fetch(`${this.#baseUrl}/types`)).json();

      const types = new Map();

      data.forEach((item) => {
        types.set(item.Name, item.Type);
      });

      return Right.create(types);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }

  async bulkInsertMeasurements(type, measurements) {
    try {
      const response = await (
        await fetch(`${this.#baseUrl}/measurements`, {
          method: "POST",
          body: JSON.stringify({
            type,
            items: measurements,
          }),
        })
      ).json();

      if (response.status >= 400 && response.status <= 500) {
        Logger.error({
          msg: "Falha ao tentar atualizar leituras",
        });

        return Left.create(new Error(response.error));
      }

      const ids = response.data.map((item) => item.IdRead);

      return Right.create(ids);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }

  async bulkUpdateMeasurements(type, measurements) {
    try {
      const response = await (
        await fetch(`${this.#baseUrl}/measurements`, {
          method: "PUT",
          body: JSON.stringify({
            type,
            items: measurements,
          }),
        })
      ).json();

      if (response.status >= 400 && response.status <= 500) {
        Logger.error({
          msg: "Falha ao tentar atualizar leituras",
        });

        return Left.create(new Error(response.error));
      }

      const ids = response.data.map((item) => item.IdRead);

      return Right.create(ids);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }
}
