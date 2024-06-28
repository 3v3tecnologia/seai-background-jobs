import { FetchEquipments } from "./fetch-equipments.js";
import { funcemeService } from "../../infra/funceme/services/funceme-service.factory.js";
import { equipmentsApi } from "../../infra/equipments/index.js";

const fetchEquipmentsService = new FetchEquipments(
  funcemeService,
  equipmentsApi
);

export { fetchEquipmentsService };
