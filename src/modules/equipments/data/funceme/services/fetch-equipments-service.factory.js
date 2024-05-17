import { equipmentsApi } from "../../services/equipments.js";
import { FTPClientAdapter } from "../external/adapters/ftp/client/ftp-client-adapter.js";

import { FetchFuncemeEquipments } from "./fetch-funceme-measures.js";

const fetchFuncemeEquipmentsWithLastMeasurementsService = new FetchFuncemeEquipments(
    new FTPClientAdapter(),
    equipmentsApi
  );

export {
  fetchFuncemeEquipmentsWithLastMeasurementsService
}