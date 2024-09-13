import "dotenv/config.js";

import { Logger } from "../../../shared/logger.js";
import { sendUserIrrigationMailService } from "../services/factories/send-user-irrigation-mail.js";

(async function run() {
  try {
    await sendUserIrrigationMailService.execute()
    process.exit(0);
  } catch (error) {
    abortController.abort();

    Logger.error({
      msg: "Falha ao agendar envio de emails das recomendações de lâmina",
      obj: error,
    });

    process.exit(1);
  }
})()

process.on("SIGINT", () => {
  console.log("Received SIGINT signal. Cleaning up...");
  // Perform cleanup tasks (e.g., close database connections, save state)
  // Then exit the process
  process.exit(0);
});
