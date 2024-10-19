import { Logger } from "../../shared/logger.js";
export class SendIrrigationReportsService {
  #irrigationService;
  #queueProvider;

  constructor(irrigationService, queueProvider) {
    this.#irrigationService = irrigationService;
    this.#queueProvider = queueProvider;
  }

  async execute() {
    const abortController = new AbortController();

    try {
      const currentDate = new Date();
      // Schedule to 9hrs AM
      currentDate.setHours(9, 0, 0, 0);

      // Convert a stream of text in a binary encoding into strings
      const decoderStream = new TextDecoder("utf-8");

      const responseStream =
        await this.#irrigationService.getIrrigationsPerUserDataStream(
          abortController.signal
        );

      while (true) {
        const { value, done } = await responseStream.read();

        if (done) {
          break;
        }

        const data = decoderStream.decode(value, { stream: true });

        if (data) {
          const {
            Name,
            Email,
            Irrigation,
            Notification
          } = JSON.parse(data)

          await this.#queueProvider.send("irrigation-reports", {
            email: Email,
            irrigation: {
              Name,
              Email,
              Irrigation,
              Notification
            }
          })

        }
      }

    } catch (error) {
      abortController.abort();

      Logger.error({
        msg: "Falha ao agendar envio de emails das recomendações de lâmina",
        obj: error,
      });

    }
  }
}
