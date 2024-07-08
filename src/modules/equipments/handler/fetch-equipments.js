import { EquipmentCommand } from "../services/commands/command.js";

import { Logger } from "../../../shared/logger.js";

export class FetchEquipments {
  static worker_name = "FuncemeEquipmentsWorker";

  #fetchEquipmentsService;

  constructor(fetchEquipmentsService) {
    this.#fetchEquipmentsService = fetchEquipmentsService;
  }

  async handle() {
    const fetchedDataOrError = await this.#fetchEquipmentsService.execute(
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
