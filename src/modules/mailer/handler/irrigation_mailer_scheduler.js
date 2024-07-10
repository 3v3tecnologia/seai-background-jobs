import { Logger } from "../../../shared/logger.js";

export class IrrigationMailerScheduler {
  static worker_name = "IrrigationMailerScheduler";

  #irrigationRecommendationService;
  #queueServices;

  static queue_options = {
    limiter: {
      max: 100000,
      duration: 70000,
    },
  };

  constructor(irrigationRecommendationService, queueServices) {
    this.#irrigationRecommendationService = irrigationRecommendationService;
    this.#queueServices = queueServices;
  }

  async handle() {
    const abortController = new AbortController();

    try {
      // Convert a stream of text in a binary encoding into strings
      const decoderStream = new TextDecoder("utf-8");

      const responseStream =
        await this.#irrigationRecommendationService.getIrrigationsPerUserDataStream(
          abortController.signal
        );

      while (true) {
        const { value, done } = await responseStream.read();

        if (done) {
          console.log("End of stream.");
          break;
        }

        const data = decoderStream.decode(value, { stream: true });

        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours());

        const day = `${currentDate.getMonth() + 1}`.padStart(2, "0")
        const month = `${currentDate.getDate()}`.padStart(2, "0")

        const formattedDate = `${currentDate.getFullYear()}/${month}/${day}`;

        if (data) {
          await this.#queueServices.enqueue("irrigation-reports", data,{
            retryDelay: 60,
            retryLimit: 3,
            startAfter: formattedDate+"T09:00:00.00Z"
          });
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

      throw error;

      // Return to queue
      //  await queueServices.nack("irrigation-reports");
    }
  }
}
