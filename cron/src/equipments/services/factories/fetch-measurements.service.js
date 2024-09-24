import { EquipmentsServices } from "../../infra/api/index.js";
import { makeFuncemeService } from "../../infra/funceme/services/funceme-service.factory.js";
import { FetchEquipmentsMeasures } from "../fetch-measurements.service.js";

const fetchEquipmentsMeasurementsService = new FetchEquipmentsMeasures(
  makeFuncemeService(),
  new EquipmentsServices()
);

export { fetchEquipmentsMeasurementsService };
