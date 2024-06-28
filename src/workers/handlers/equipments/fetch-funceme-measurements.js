import { EquipmentCommand } from "../../../modules/equipments/services/commands/command.js";

import { fetchEquipmentsMeasurementsService } from "../../../modules/equipments/services/factories/fetch-measurements.service.js";
import { Logger } from "../../../shared/logger.js";

export class FetchFuncemeMeasurementsWorker {
  static worker_name = "FetchFuncemeMeasurements";

  static async handler() {
    const fetchedDataOrError = await fetchEquipmentsMeasurementsService.execute(
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
