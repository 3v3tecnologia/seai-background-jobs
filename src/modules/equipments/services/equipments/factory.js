import { FetchEquipments } from "./fetch-equipments.js";
import { makeFetchFuncemeEquipments } from "../../data/funceme/services/fetch-equipments-service.factory.js";
import { EquipmentsServices } from "../../data/services/index.js";

export const makeFetchEquipments = () => {
  return new FetchEquipments(
    makeFetchFuncemeEquipments(),
    new EquipmentsServices()
  );
};
