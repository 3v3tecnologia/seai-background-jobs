import nodemailer from "nodemailer";
import { Logger } from "./logger.js";


export class EmailService {

  constructor(mailer_options, mailer_transport_config) {
    this.mailer_transport_config = mailer_transport_config
    this.mailer_options = mailer_options
  }

  async #sendMail(command) {
    const transporter = nodemailer.createTransport(this.mailer_transport_config);

    return new Promise((resolve, reject) => {
      transporter.sendMail(command, (err, info) => {
        if (err) return reject(err);
        resolve(info);
      });
    });
  }


  async send(options) {
    const command = {
      from: this.mailer_options.from,
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

    if (options.bcc) {
      Object.assign(command, {
        bcc: options.bcc,
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

    await this.#sendMail(command);


    Logger.info({
      msg: "Email enviado com sucesso",
    });
  }
}
