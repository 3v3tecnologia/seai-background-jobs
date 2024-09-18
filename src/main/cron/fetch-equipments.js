import "dotenv/config.js";

import { fetchEquipmentsService } from "../../modules/equipments/services/factories/fetch-equipments.service.js";
import { EquipmentCommand } from "../../modules/equipments/services/commands/command.js";
import { Logger } from "../../shared/logger.js";

(async function () {
  try {
    await fetchEquipmentsService.execute(new EquipmentCommand());
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