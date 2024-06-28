import { FetchEquipmentsMeasures } from "../fetch-measurements.service.js";
import { funcemeService } from "../../infra/funceme/services/funceme-service.factory.js";
import { equipmentsApi } from "../../infra/api/index.js";

const fetchEquipmentsMeasurementsService = new FetchEquipmentsMeasures(
  funcemeService,
  equipmentsApi
);

export { fetchEquipmentsMeasurementsService };
