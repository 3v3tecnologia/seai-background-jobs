import "dotenv/config.js";

import { pgBoss } from "../../../main/lib/queue/pg-boss.js";
import { Logger } from "../../../shared/logger.js";
import { IrrigationRecommendationsService } from "../infra/api/irrigation.service.js";

async function run() {
  const abortController = new AbortController();

  try {
    const currentDate = new Date();
    // Schedule to 9hrs AM
    currentDate.setHours(9, 0, 0, 0);

    const startAfter = currentDate.toISOString();
    // Convert a stream of text in a binary encoding into strings
    const decoderStream = new TextDecoder("utf-8");

    const responseStream =
      await new IrrigationRecommendationsService().getIrrigationsPerUserDataStream(
        abortController.signal
      );

    while (true) {
      const { value, done } = await responseStream.read();

      if (done) {
        console.log("End of stream.");
        break;
      }

      const data = decoderStream.decode(value, { stream: true });

      if (data) {
        await pgBoss.enqueue("irrigation-reports", data, {
          retryDelay: 60,
          retryLimit: 3,
          startAfter,
        });
      }
    }

    Logger.info({
      msg: `Sucesso ao agendar relatórios de recomendação de lâmina para ${startAfter}`,
    });

    process.exit(0);
  } catch (error) {
    abortController.abort();

    Logger.error({
      msg: "Falha ao agendar envio de emails das recomendações de lâmina",
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
