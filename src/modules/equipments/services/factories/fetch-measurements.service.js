import { EquipmentsServices } from "../../infra/api/index.js";
import { funcemeService } from "../../infra/funceme/services/funceme-service.factory.js";
import { FetchEquipmentsMeasures } from "../fetch-measurements.service.js";

const fetchEquipmentsMeasurementsService = new FetchEquipmentsMeasures(
  funcemeService,
  new EquipmentsServices()
);

export { fetchEquipmentsMeasurementsService };
