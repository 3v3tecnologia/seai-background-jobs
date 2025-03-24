import { Logger } from "../../shared/logger.js";
export class SendIrrigationReportsService {
  #irrigationService;
  #queueProvider;

  constructor(irrigationService, queueProvider) {
    this.#irrigationService = irrigationService;
    this.#queueProvider = queueProvider;
  }

  async scheduleIrrigationRecommendation(user_irrigation) {
    try {
      const {
        Name,
        Email,
        Irrigation,
        Notification
      } = JSON.parse(user_irrigation)

      await this.#queueProvider.send("irrigation-suggestion", {
        email: Email,
        irrigation: {
          Name,
          Email,
          Irrigation,
          Notification
        }
      })

      Logger.info({ msg: `Relatório de irrigação para o usuário "${Email}" agendado com sucesso` })

    } catch (error) {
      Logger.error({
        msg: "Erro ao fazer parse dos dados de irrigação",
        obj: error,
      });
    }
  }

  async execute() {
    const abortController = new AbortController();

    try {
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
          // Divide os dados em linhas e processa cada linha individualmente
          // OBS: pode acontecer de na requisição receber vários JSON's então basta separar cada um pelo o delimitador NEWLINE ("\n")
          // e processar cada item individualmente.
          const lines = data.split('\n').filter(line => line.trim().length > 0);

          for (const line of lines) {
            await this.scheduleIrrigationRecommendation(line)
          }

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
