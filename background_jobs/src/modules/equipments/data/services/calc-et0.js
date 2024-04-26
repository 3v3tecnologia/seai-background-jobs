import { SEAI_BASE_URL } from "../../../../shared/config/seaiApi.js";
import { Logger } from "../../../../shared/logger.js";
import { Left, Right } from "../../../../shared/result.js";

export class CalcEt0ByEquipmentsMeasurements {
  #url;
  constructor() {
    this.#url = SEAI_BASE_URL + "/api/v1/equipments/measurements/et0";
  }
  async execute(ids = []) {
    console.log("[CalcET0] :: calculating Et0 measurements by equipments");
    console.log("Ids :: ", ids);
    console.log("[CalcET0] Realizando requisição pra o endereço ", this.#url);

    try {
      const response = await fetch(this.#url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Measurements: ids,
        }),
      });

      const { data } = await response.json();

      if (response.status >= 400 && response.status <= 500) {
        Logger.error({
          msg: "Falha ao tentar calcular ET0 dos equipamentos",
        });
        return Left.create(new Error(data));
      }

      return Right.create(data);
    } catch (error) {
      Logger.error({
        msg: "Falha ao tentar calcular ET0 dos equipamentos",
      });

      return Left.create(
        new Error("Falha ao tentar calcular ET0 dos equipamentos")
      );
    }
  }
}
