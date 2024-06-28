import { QueueServices } from "../../../../shared/jobQueue/queue.service.js";
import { irrigationRecommendationsService } from "../../infra/api/irrigation.service.js";
import { ScheduleIrrigationMail } from "../schedule-irrigation-mail.service.js";

const scheduleIrrigationMailService = new ScheduleIrrigationMail(
  new QueueServices(),
  new irrigationRecommendationsService()
);

export { scheduleIrrigationMailService };
