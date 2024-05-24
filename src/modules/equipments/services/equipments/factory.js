import { FetchEquipments } from "./fetch-equipments.js";
import { funcemeService } from "../../data/funceme/services/funceme-service.factory.js";
import { equipmentsApi } from "../../data/services/index.js";

const fetchEquipmentsService = new FetchEquipments(
  funcemeService,
  equipmentsApi
);

export { fetchEquipmentsService };
