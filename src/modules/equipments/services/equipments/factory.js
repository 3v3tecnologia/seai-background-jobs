import { FetchEquipments } from "./fetch-equipments.js";
import { fetchFuncemeEquipmentsWithLastMeasurementsService } from "../../data/funceme/services/fetch-equipments-service.factory.js";
import { equipmentsApi } from "../../data/services/index.js";


const fetchEquipmentsService = new FetchEquipments(
    fetchFuncemeEquipmentsWithLastMeasurementsService,
    equipmentsApi
  );

export {
  fetchEquipmentsService
}