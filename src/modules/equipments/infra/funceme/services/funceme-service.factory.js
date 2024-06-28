import { equipmentsApi } from "../../../../equipments/infra/api/equipments.service.js";
import { FTPClientAdapter } from "../external/adapters/ftp/client/ftp-client-adapter.js";

import { FetchFuncemeEquipments } from "../services/funceme.service.js";

const funcemeService = new FetchFuncemeEquipments(
  new FTPClientAdapter(),
  equipmentsApi
);

export { funcemeService };
