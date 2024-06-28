import { equipmentsApi } from "../../equipments/equipments.service.js";
import { FTPClientAdapter } from "../external/adapters/ftp/client/ftp-client-adapter.js";

import { FetchFuncemeEquipments } from "./funceme.js";

const funcemeService = new FetchFuncemeEquipments(
  new FTPClientAdapter(),
  equipmentsApi
);

export { funcemeService };
