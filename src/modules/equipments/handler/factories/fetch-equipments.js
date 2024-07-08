import { fetchEquipmentsService } from "../../services/factories/fetch-equipments.service.js";
import { FetchEquipments } from "../fetch-equipments.js";

export const fetchEquipment = new FetchEquipments(fetchEquipmentsService);
