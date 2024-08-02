import "dotenv/config.js";

import { fetchEquipmentsService } from "../services/factories/fetch-equipments.service.js";
import { EquipmentCommand } from "../services/commands/command.js";
import { Logger } from "../../../shared/logger.js";

async function run() {
  try {
    await fetchEquipmentsService.execute(new EquipmentCommand());
    process.exit(0);
  } catch (error) {
    Logger.error({
      obj: error,
    });
    process.exit(1);
  }
}

run();

process.on("SIGINT", () => {
  console.log("Received SIGINT signal. Cleaning up...");
  // Perform cleanup tasks (e.g., close database connections, save state)
  // Then exit the process
  process.exit(0);
});
