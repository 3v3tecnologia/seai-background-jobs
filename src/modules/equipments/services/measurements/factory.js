import { FetchEquipmentsMeasures } from "./fetch-measurements.js";
import { funcemeService } from "../../data/funceme/services/funceme-service.factory.js";
import { equipmentsApi } from "../../data/services/index.js";

const fetchEquipmentsMeasurementsService = new FetchEquipmentsMeasures(
  funcemeService,
  equipmentsApi
);

export { fetchEquipmentsMeasurementsService };
