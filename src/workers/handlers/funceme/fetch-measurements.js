import { EquipmentCommand } from "../../../modules/equipments/services/commands/command.js";

import { fetchEquipmentsMeasurementsService } from "../../../modules/equipments/services/measurements/factory.js";

export class FetchFuncemeMeasurementsWorker {
  static name_queue = "funceme-measurements";
  static worker_name = "FetchFuncemeMeasurements";

  static async handler() {
    const fetchedDataOrError = await fetchEquipmentsMeasurementsService.execute(new EquipmentCommand());

    if (fetchedDataOrError.isError()) {
      throw fetchedDataOrError.error();
    }

    return;
  }
}
