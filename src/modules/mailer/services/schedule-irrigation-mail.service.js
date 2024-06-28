import { pgBoss } from "../../../shared/jobQueue/pg-boss.js";
import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { irrigationRecommendationsService } from "../infra/api/irrigation.service.js";

export class ScheduleIrrigationMail {
  #queueServices;
  #irrigationRecommendationService;

  constructor(queueServices, irrigationRecommendationService) {
    this.#queueServices = queueServices;
    this.#irrigationRecommendationService = irrigationRecommendationService;
  }

  async execute() {
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

        // Process the chunk (e.g., log it or manipulate it)
        console.log("to js data: ", JSON.parse(data));

        //What if the jobs services is down?
        if (data) {
          await this.#queueServices.enqueue("irrigation-reports", data);
        }
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
