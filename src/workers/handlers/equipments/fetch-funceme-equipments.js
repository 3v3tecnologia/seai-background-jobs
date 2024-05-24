import { EquipmentCommand } from "../../../modules/equipments/services/commands/command.js";

import { fetchEquipmentsService } from "../../../modules/equipments/services/equipments/factory.js";
import { Logger } from "../../../shared/logger.js";

export class FetchFuncemeEquipmentsWorker {
  static worker_name = "FuncemeEquipmentsWorker";

  static async handler() {
    const fetchedDataOrError = await fetchEquipmentsService.execute(
      new EquipmentCommand()
    );

    if (fetchedDataOrError.isError()) {
      Logger.error({
        msg: "Falha ao buscar equipamentos",
        obj: fetchedDataOrError.error(),
      });
      throw fetchedDataOrError.error();
    }

    return;
  }
}
