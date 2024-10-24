import { EquipmentsServices } from "../../infra/api/equipments.service.js";
import { makeFuncemeService } from "../../infra/funceme/services/funceme-service.factory.js";
import { GeolocationProvider } from "../../infra/geolocation-provider.js";
import { FetchEquipments } from "../fetch-equipments.service.js";

const fetchEquipmentsService = new FetchEquipments(
  makeFuncemeService(),
  new EquipmentsServices(),
  new GeolocationProvider()
);

export { fetchEquipmentsService };

