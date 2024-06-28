import nodemailer from "nodemailer";
import {
  MAILER_OPTIONS,
  MAILER_TRANSPORT_CONFIG,
} from "../../config/mailer.js";
import { Logger } from "../../../../shared/logger.js";

export class SendEmailService {
  async sendMail(command) {
    const transporter = nodemailer.createTransport(MAILER_TRANSPORT_CONFIG);

    return new Promise((resolve, reject) => {
      transporter.sendMail(command, (err, info) => {
        if (err) return reject(err);
        resolve(info);
      });
    });
  }

  async send(options) {
    const command = {
      from: MAILER_OPTIONS.from,
      to: options.to,
      subject: options.subject,
      attachments: options.attachments,
    };

    if (options.text) {
      Object.assign(command, {
        text: options.text,
      });
    }

    if (options.html) {
      Object.assign(command, {
        html: options.html,
      });
    }

    if (options.cc) {
      Object.assign(command, {
        cc: options.cc,
      });
    }

    /**
     * {
        accepted: [ ],
        rejected: [],
        ehlo: [ ],
        envelopeTime: ,
        messageTime: ,
        messageSize: ,
        response: '',
        envelope: {
          from: '',
          to: [ '' ]
        },
        messageId: ''
      }
     */

    const data = await this.sendMail(command);

    Logger.info({
      msg: "Email enviado com sucesso",
    });

    Logger.info({
      msg: data.response,
    });
  }
}
