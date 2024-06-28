import { pgBoss } from "../../../../shared/jobQueue/pg-boss.js";
import { irrigationRecommendationsService } from "../../infra/api/irrigation.service.js";
import { ScheduleIrrigationMail } from "../schedule-irrigation-mail.service.js";

const scheduleIrrigationMailService = new ScheduleIrrigationMail(
  pgBoss,
  irrigationRecommendationsService
);

export { scheduleIrrigationMailService };
