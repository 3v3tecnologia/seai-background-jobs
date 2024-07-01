import { EquipmentsServices } from "../../infra/api/equipments.service.js";
import { funcemeService } from "../../infra/funceme/services/funceme-service.factory.js";
import { FetchEquipments } from "../fetch-equipments.service.js";

const fetchEquipmentsService = new FetchEquipments(
  funcemeService,
  new EquipmentsServices()
);

export { fetchEquipmentsService };
