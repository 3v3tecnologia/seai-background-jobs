import { IrrigationRecommendationsService } from "../../infra/api/irrigation.service.js";
import { RabbitMqAdapter } from "../../infra/queue/rabbitmq/rabbitmq.js";
import { SendIrrigationReportsService } from "../send-user-irrigation-mail.service.js";

const sendUserIrrigationMailService = new SendIrrigationReportsService(
  new IrrigationRecommendationsService(),
  new RabbitMqAdapter(RABBIT_MQ_URL)
);

export { sendUserIrrigationMailService };
