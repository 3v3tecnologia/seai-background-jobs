import "dotenv/config.js";

import { Logger } from "../../../shared/logger.js";
import { EquipmentCommand } from "../services/commands/command.js";
import { fetchEquipmentsMeasurementsService } from "../services/factories/fetch-measurements.service.js";

async function run() {
  try {
    await fetchEquipmentsMeasurementsService.execute(new EquipmentCommand());
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
