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
  async getByTypes(type) {
    try {
      const { data } = await (
        await fetch(`${this.#baseUrl}?type=${type}`)
      ).json();

      return Right.create(data);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }
  async getTypes() {
    try {
      const { data } = await (await fetch(`${this.#baseUrl}/types`)).json();
      return Right.create(data);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }
}
