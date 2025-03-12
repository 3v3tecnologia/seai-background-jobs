import { ASYNC_JOB_URL } from "../../../../../workers/src/infra/queue/pg-boss/connection.js";
import { IrrigationRecommendationsService } from "../../infra/api/irrigation.service.js";
import { PgBossMqAdapter } from "../../infra/queue/pg-boss/pgBoss.js";
import { SendIrrigationReportsService } from "../send-user-irrigation-mail.service.js";

const sendUserIrrigationMailService = new SendIrrigationReportsService(
  new IrrigationRecommendationsService(),
  new PgBossMqAdapter(ASYNC_JOB_URL)
);

export { sendUserIrrigationMailService };
