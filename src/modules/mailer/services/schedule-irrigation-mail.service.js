import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";

export class ScheduleIrrigationMail {
  #queueServices;
  #irrigationRecommendationService;

  constructor(queueServices, irrigationRecommendationService) {
    this.#queueServices = queueServices;
    this.#irrigationRecommendationService = irrigationRecommendationService;
  }

  async execute() {
    const abortController = new AbortController();
    // Convert a stream of text in a binary encoding into strings
    const decoderStream = new TextDecoder("utf-8");

    const responseStream =
      await this.#irrigationRecommendationService.getIrrigationsPerUserDataStream(
        abortController.signal
      );

    try {
      while (true) {
        const { chunk, done } = await responseStream.read();

        if (done) {
          console.log("End of stream.");
          break;
        }

        const data = decoderStream.decode(chunk);

        // Process the chunk (e.g., log it or manipulate it)
        console.log("data: ", JSON.parse(data));

        //What if the jobs services is down?
        await this.#queueServices.enqueue("irrigation-reports", data);
      }

      return Right.create(
        "Sucesso ao agendar relatórios de recomendação de lâmina"
      );
    } catch (error) {
      abortController.abort();

      Logger.error({
        msg: "Falha ao agendar envio de emails das recomendações de lâmina",
        obj: error,
      });

      return Left.create(error);
    }
  }
}
