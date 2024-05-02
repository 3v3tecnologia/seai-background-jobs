import { EquipmentsServices } from "../../services/equipments.js";
import { FTPClientAdapter } from "../external/adapters/ftp/client/ftp-client-adapter.js";

import { FetchFuncemeEquipments } from "./fetch-funceme-measures.js";

export const makeFetchFuncemeEquipments = () => {
  return new FetchFuncemeEquipments(
    new FTPClientAdapter(),
    new EquipmentsServices()
  );
};
