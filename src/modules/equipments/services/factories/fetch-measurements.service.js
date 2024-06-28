import { FetchEquipmentsMeasures } from "./fetch-measurements.js";
import { funcemeService } from "../../infra/funceme/services/funceme-service.factory.js";
import { equipmentsApi } from "../../infra/equipments/index.js";

const fetchEquipmentsMeasurementsService = new FetchEquipmentsMeasures(
  funcemeService,
  equipmentsApi
);

export { fetchEquipmentsMeasurementsService };
