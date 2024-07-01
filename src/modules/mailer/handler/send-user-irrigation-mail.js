import { SendUserIrrigationMailDTO } from "../services/commands/send-user-irrigation-mail.js";
import { sendUserIrrigationMailService } from "../services/factories/send-user-irrigation-mail.js";
import { Validator } from "../../../shared/validator.js";

export class SendUserIrrigationMail {
  static worker_name = "SendUserIrrigationMail";

  static queue_options = {
    limiter: {
      max: 100000,
      duration: 70000,
    },
  };

  static async handler(payload) {
    const payloadOrError = Validator.againstEmptyArray(
      payload,
      "Worker payload is null or undefined."
    );

    if (payloadOrError.isError()) {
      throw resultOrError.error();
    }

    // Destruct from pg-boss job payload object
    const { id, data, name } = payload[0];

    const dto = new SendUserIrrigationMailDTO(data);

    const resultOrError = await sendUserIrrigationMailService.execute(dto);

    if (resultOrError.isError()) {
      throw resultOrError.error();
    }

    return;
  }
}
