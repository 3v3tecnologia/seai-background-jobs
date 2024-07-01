import { EquipmentCommand } from "../services/commands/command.js";

import { fetchEquipmentsService } from "../services/factories/fetch-equipments.service.js";
import { Logger } from "../../../shared/logger.js";

export class FetchEquipments {
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
