// npm run test:dev -i __tests__/units/services/send-newsletter/send-newsletter.spec.js
import { describe, expect, jest, test } from "@jest/globals";

import { SendNewsletterCommand } from "../../services/commands/send-newsletter.js";
import { SendNewsletterEmail } from "../../services/send-newsletter.js";
import { NewsletterServicesFaker } from "../doubles/infra/services/faker-newsletter-api.js";
import { NodemailerAdapterStub } from "../doubles/infra/services/mailer/send-email.js";

describe("# Send Newsletter", () => {
  test("When has news should be able to send newsletter emails", async () => {
    const IdNews = 1;

    const newsletterToSend = {
      Id: IdNews,
      Author: {
        Id: 1,
        Email: "test@gmail.com",
        Organ: "organX",
      },
      Title: "test",
      Description: "test",
      Data: {
        type: "Buffer",
        data: [
          60, 112, 62, 60, 115, 112, 97, 110, 32, 115, 116, 121, 108, 101, 61,
          34, 99, 111, 108, 111, 114, 58, 32, 114, 103, 98, 40, 50, 51, 48, 44,
          32, 48, 44, 32, 48, 41, 59, 34, 62, 69, 109, 32, 70, 111, 114, 116,
          97, 108, 101, 122, 97, 32, 104, 195, 161, 60, 47, 115, 112, 97, 110,
          62, 32, 60, 101, 109, 62, 113, 117, 97, 108, 113, 117, 101, 114, 32,
          109, 111, 109, 101, 110, 116, 111, 32, 100, 111, 60, 47, 101, 109, 62,
          32, 60, 115, 116, 114, 111, 110, 103, 62, 100, 105, 97, 32, 99, 97,
          195, 173, 32, 195, 161, 103, 117, 97, 60, 47, 115, 116, 114, 111, 110,
          103, 62, 60, 47, 112, 62,
        ],
      },
      SendAt: null,
    };

    const subscribers = ["test1@gmail.com"];

    const newsletterService = new NewsletterServicesFaker(
      [newsletterToSend],
      subscribers
    );

    const sendEmailService = new NodemailerAdapterStub();
    const sendEmailServiceWatch = jest.spyOn(sendEmailService, "send");

    const command = new SendNewsletterCommand({
      id: IdNews,
    });

    const sendNewsletter = new SendNewsletterEmail(
      newsletterService,
      sendEmailService
    );

    const result = await sendNewsletter.execute(command);

    expect(sendEmailServiceWatch).toBeCalledTimes(1);

    expect(sendEmailServiceWatch).toBeCalledWith({
      to: subscribers.join(","),
      subject: "NEWSLETTER",
      html: '<p><span style="color: rgb(230, 0, 0);">Em Fortaleza há</span> <em>qualquer momento do</em> <strong>dia caí água</strong></p>',
      cc: "*******",
    });

    expect(result.isSuccess()).toBeTruthy();
    expect(result.data).toBe("Sucesso ao enviar notícia");
  });

  test("When news is not exists should'n be able to send newsletter emails", async () => {
    const IdNews = 1;

    const subscribers = ["test1@gmail.com"];

    const newsletterService = new NewsletterServicesFaker([], subscribers);

    const sendEmailService = new NodemailerAdapterStub();
    const sendEmailServiceWatch = jest.spyOn(sendEmailService, "send");

    const sendNewsletter = new SendNewsletterEmail(
      newsletterService,
      sendEmailService
    );

    const command = new SendNewsletterCommand({
      id: IdNews,
    });

    const result = await sendNewsletter.execute(command);

    expect(result.isSuccess()).toBeFalsy();
    expect(result.err.message).toBe(`Notícia ${IdNews} não existe`);
    expect(sendEmailServiceWatch).toBeCalledTimes(0);
  });

  test("When subscriber is not exists should be able to send newsletter to default emails", async () => {
    const IdNews = 1;

    const newsletterToSend = {
      Id: IdNews,
      Author: {
        Id: 1,
        Email: "test@gmail.com",
        Organ: "organX",
      },
      Title: "test",
      Description: "test",
      Data: {
        type: "Buffer",
        data: [
          60, 112, 62, 60, 115, 112, 97, 110, 32, 115, 116, 121, 108, 101, 61,
          34, 99, 111, 108, 111, 114, 58, 32, 114, 103, 98, 40, 50, 51, 48, 44,
          32, 48, 44, 32, 48, 41, 59, 34, 62, 69, 109, 32, 70, 111, 114, 116,
          97, 108, 101, 122, 97, 32, 104, 195, 161, 60, 47, 115, 112, 97, 110,
          62, 32, 60, 101, 109, 62, 113, 117, 97, 108, 113, 117, 101, 114, 32,
          109, 111, 109, 101, 110, 116, 111, 32, 100, 111, 60, 47, 101, 109, 62,
          32, 60, 115, 116, 114, 111, 110, 103, 62, 100, 105, 97, 32, 99, 97,
          195, 173, 32, 195, 161, 103, 117, 97, 60, 47, 115, 116, 114, 111, 110,
          103, 62, 60, 47, 112, 62,
        ],
      },
      SendAt: null,
    };

    const newsletterService = new NewsletterServicesFaker([newsletterToSend]);

    const sendEmailService = new NodemailerAdapterStub();
    const sendEmailServiceWatch = jest.spyOn(sendEmailService, "send");

    const command = new SendNewsletterCommand({
      id: IdNews,
    });

    const sendNewsletter = new SendNewsletterEmail(
      newsletterService,
      sendEmailService
    );

    const result = await sendNewsletter.execute(command);
    expect(result.isError()).toBeTruthy();
    expect(result.error().message).toBe("Deve haver no mínimo um destinatário");
  });
});
