import { scheduleIrrigationMailService } from "../../../modules/mailer/services/factories/schedule-irrigation-mail.js";

export class IrrigationMailerScheduler {
  static worker_name = "IrrigationMailerScheduler";

  static queue_options = {
    limiter: {
      max: 100000,
      duration: 70000,
    },
  };

  static async handler() {
    const resultOrError = await scheduleIrrigationMailService.execute();

    if (resultOrError.isError()) {
      throw resultOrError.error();
    }

    return;
  }
}
