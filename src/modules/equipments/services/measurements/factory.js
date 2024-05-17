import { FetchEquipmentsMeasures } from "./fetch-measurements.js";
import { fetchFuncemeEquipmentsWithLastMeasurementsService } from "../../data/funceme/services/fetch-equipments-service.factory.js";
import { equipmentsApi } from "../../data/services/index.js";

const fetchEquipmentsMeasurementsService = new FetchEquipmentsMeasures(
    fetchFuncemeEquipmentsWithLastMeasurementsService,
    equipmentsApi
  );

export {
  fetchEquipmentsMeasurementsService
}