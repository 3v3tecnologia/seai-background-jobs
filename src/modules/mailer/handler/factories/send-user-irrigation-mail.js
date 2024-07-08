import { sendUserIrrigationMailService } from "../../services/factories/send-user-irrigation-mail.js";
import { SendUserIrrigationMail } from "../send-user-irrigation-mail.js";

export const sendUserIrrigationMail = new SendUserIrrigationMail(
  sendUserIrrigationMailService
);
