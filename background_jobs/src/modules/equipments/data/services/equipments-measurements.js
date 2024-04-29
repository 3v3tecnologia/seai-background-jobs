import { SEAI_BASE_URL } from "../../../../shared/config/seaiApi.js";
import { Logger } from "../../../../shared/logger.js";
import { Left, Right } from "../../../../shared/result.js";

export class EquipmentsMeasurementsServices {
  #baseUrl;
  constructor() {
    this.#baseUrl = SEAI_BASE_URL + "/api/v2/equipments/measurements";
  }
  async bulkInsert(type, measurements) {
    try {
      const response = await (
        await fetch(`${this.#baseUrl}`, {
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

      return Right.create(response.data);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }
  async bulkUpdate(type, measurements) {
    try {
      const response = await (
        await fetch(`${this.#baseUrl}`, {
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

      return Right.create(response.data);
    } catch (error) {
      console.log(error);
      return Left.create(new Error(error));
    }
  }
}
