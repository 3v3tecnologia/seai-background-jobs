import { pgBoss } from "../../../../main/lib/queue/pg-boss.js";
import { IrrigationRecommendationsService } from "../../infra/api/irrigation.service.js";
import { IrrigationMailerScheduler } from "../irrigation_mailer_scheduler.js";

export const irrigationMailerScheduler = new IrrigationMailerScheduler(
  new IrrigationRecommendationsService(),
  pgBoss
);
