import { EquipmentCommand } from "../../../modules/equipments/services/commands/command.js";

import { fetchEquipmentsService } from "../../../modules/equipments/services/equipments/factory.js";

export class FetchFuncemeEquipmentsWorker {
  static name_queue = "funceme-equipments";
  static worker_name = "FuncemeEquipmentsWorker";

  static async handler() {
    const fetchedDataOrError = await fetchEquipmentsService.execute(new EquipmentCommand());

    if (fetchedDataOrError.isError()) {
      throw fetchedDataOrError.error();
    }

    return;
  }
}
