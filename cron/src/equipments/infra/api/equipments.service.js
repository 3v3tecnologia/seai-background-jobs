
import { SEAI_API_KEY } from "../../../config/api-key.js";
import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { EQUIPMENTS_API_BASE_URL } from "../../config/equipments-api.js";

export class EquipmentsServices {
  async getMeteorologicalOrganIdentifier(organName) {
    try {
      const { data } = await (
        await fetch(
          `${EQUIPMENTS_API_BASE_URL}/meteorological_organ/access_credentials?organName=${organName}`,
          {
            headers: {
              "Access-Key": SEAI_API_KEY,
            },
          }
        )
      ).json();

      if (data) {
        const { Id } = data;

        return {
          Id
        };
      }

      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async bulkInsert({ items, id_organ }) {
    try {
      console.log("bulkInsert ", { items, id_organ });
      const response = await fetch(EQUIPMENTS_API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type
          "Access-Key": SEAI_API_KEY,
        },
        body: JSON.stringify({
          items,
          id_organ,
        }),
      });

      if (response.status >= 400 && response.status <= 500) {
        Logger.error({
          msg: "Falha ao tentar atualizar leituras",
        });

        return Left.create(new Error(response.error));
      }

      const result = await response.json();

      return Right.create(result.data);
    } catch (error) {
      console.error(error);
      return Left.create(new Error(error));
    }
  }

  async getEquipmentsByTypes(types = ["station", "pluviometer"]) {
    try {
      const organizedByTypes = new Map();

      for (const type of types) {
        const organizedByCodes = new Map();

        const { data } = await (
          await fetch(`${EQUIPMENTS_API_BASE_URL}?type=${type}`, {
            headers: {
              "Access-Key": SEAI_API_KEY,
            },
          })
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

      // if (
      //   [
      //     organizedByTypes.get("station").size,
      //     organizedByTypes.get("pluviometer").size,
      //   ].every((cond) => cond === 0)
      // ) {
      //   return Left.create(new Error("Não há equipamentos cadastrados"));
      // }

      return Right.create(organizedByTypes);
    } catch (error) {
      console.error(error);
      return Left.create(new Error(error));
    }
  }

  async getTypes() {
    try {
      const { data } = await (
        await fetch(`${EQUIPMENTS_API_BASE_URL}/types`, {
          headers: {
            "Access-Key": SEAI_API_KEY,
          },
        })
      ).json();

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
      console.error(error);
      return Left.create(new Error(error));
    }
  }

  async bulkInsertMeasurements({ type, items, id_organ, date }) {
    try {
      const response = await fetch(`${EQUIPMENTS_API_BASE_URL}/measurements`, {
        headers: {
          "Content-Type": "application/json", // Set the content type
          "Access-Key": SEAI_API_KEY,
        },
        method: "POST",
        body: JSON.stringify({
          type,
          items,
          id_organ,
          date,
        }),
      });

      if (response.status >= 400 && response.status <= 500) {
        Logger.error({
          msg: "Falha ao tentar atualizar leituras",
        });

        return Left.create(new Error(response.error));
      }

      const { data } = await response.json();

      Logger.info({
        msg: `Sucesso ao salva leituras de ${type}`,
      });

      return Right.create(data);
    } catch (error) {
      console.error(error);
      return Left.create(new Error(error));
    }
  }
}

