import { FTPClientAdapter } from "../external/adapters/ftp/client/ftp-client-adapter.js";

import { FetchFuncemeEquipments } from "../services/funceme.service.js";

import { EquipmentsServices } from "../../api/equipments.service.js";

const makeFuncemeService = () => new FetchFuncemeEquipments(
  new FTPClientAdapter(),
  new EquipmentsServices()
);

export { makeFuncemeService };
