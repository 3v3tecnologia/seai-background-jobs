import { Logger } from "../../../shared/logger.js";
import { pgBoss } from "../../../main/lib/queue/pg-boss.js";
import { IrrigationRecommendationsService } from "../infra/api/irrigation.service.js";

export class IrrigationMailerScheduler {
  static worker_name = "IrrigationMailerScheduler";

  static queue_options = {
    limiter: {
      max: 100000,
      duration: 70000,
    },
  };

  static async handler() {
    const queueServices = pgBoss;

    const irrigationRecommendationService =
      new IrrigationRecommendationsService();

    const abortController = new AbortController();

    try {
      // Convert a stream of text in a binary encoding into strings
      const decoderStream = new TextDecoder("utf-8");

      const responseStream =
        await irrigationRecommendationService.getIrrigationsPerUserDataStream(
          abortController.signal
        );

      while (true) {
        const { value, done } = await responseStream.read();

        if (done) {
          console.log("End of stream.");
          break;
        }

        const data = decoderStream.decode(value, { stream: true });

        // Process the chunk (e.g., log it or manipulate it)
        console.log("to js data: ", JSON.parse(data));

        //What if the jobs services is down?
        if (data) {
          await queueServices.enqueue("irrigation-reports", data);
        }
      }

      Logger.info({
        msg: "Sucesso ao agendar relatórios de recomendação de lâmina",
      });
    } catch (error) {
      abortController.abort();

      Logger.error({
        msg: "Falha ao agendar envio de emails das recomendações de lâmina",
        obj: error,
      });

      if (resultOrError.isError()) {
        //  await queueServices.nack("irrigation-reports");
        throw resultOrError.error();
      }

      // Return to queue
      //  await queueServices.nack("irrigation-reports");
    }
  }
}
