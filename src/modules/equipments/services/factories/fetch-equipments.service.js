import { FetchEquipments } from "../fetch-equipments.service.js";
import { funcemeService } from "../../infra/funceme/services/funceme-service.factory.js";
import { equipmentsApi } from "../../infra/api/index.js";

const fetchEquipmentsService = new FetchEquipments(
  funcemeService,
  equipmentsApi
);

export { fetchEquipmentsService };
