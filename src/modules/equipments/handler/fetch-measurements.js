import { EquipmentCommand } from "../services/commands/command.js";

import { Logger } from "../../../shared/logger.js";

export class FetchEquipmentsMeasurements {
  static worker_name = "FetchFuncemeMeasurements";

  #fetchEquipmentsMeasurementsService;

  constructor(fetchEquipmentsMeasurementsService) {
    this.#fetchEquipmentsMeasurementsService =
      fetchEquipmentsMeasurementsService;
  }

  async handle() {
    const fetchedDataOrError =
      await this.#fetchEquipmentsMeasurementsService.execute(
        new EquipmentCommand()
      );

    if (fetchedDataOrError.isError()) {
      Logger.error({
        msg: "Falha ao buscar leituras",
        obj: fetchedDataOrError.error(),
      });
      throw fetchedDataOrError.error();
    }

    return;
  }
}
