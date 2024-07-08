import { fetchEquipmentsMeasurementsService } from "../../services/factories/fetch-measurements.service.js";
import { FetchEquipmentsMeasurements } from "../fetch-measurements.js";

export const fetchEquipmentMeasurements = new FetchEquipmentsMeasurements(
  fetchEquipmentsMeasurementsService
);
