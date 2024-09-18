import "dotenv/config.js";

import { Logger } from "../../shared/logger.js";
import { EquipmentCommand } from "../../modules/equipments/services/commands/command.js";
import { fetchEquipmentsMeasurementsService } from "../../modules/equipments/services/factories/fetch-measurements.service.js";

(async function () {
  try {
    await fetchEquipmentsMeasurementsService.execute(new EquipmentCommand());

    process.exit(0);

  } catch (error) {
    Logger.error({
      obj: error,
    });
    process.exit(1);
  }
})()


process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error.message);
  process.exit(1); // Exit with error
});