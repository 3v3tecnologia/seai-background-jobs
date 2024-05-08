import { FetchEquipmentsMeasures } from "./fetch-measurements.js";
import { makeFetchFuncemeEquipments } from "../../data/funceme/services/fetch-equipments-service.factory.js";
import { EquipmentsServices } from "../../data/services/index.js";

export const makeFetchEquipmentsMeasurements = () => {
  return new FetchEquipmentsMeasures(
    makeFetchFuncemeEquipments(),
    new EquipmentsServices()
  );
};