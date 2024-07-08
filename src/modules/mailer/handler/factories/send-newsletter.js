import { sendNewsletterEmailService } from "../../services/factories/send-newsletter.js";
import { SendNewsletter } from "../send-newsletter.js";

export const sendNewsletter = new SendNewsletter(sendNewsletterEmailService);
