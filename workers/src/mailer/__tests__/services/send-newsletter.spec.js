// npm run test:unit -i src/modules/mailer/__tests__/services/send-newsletter.spec.js
import { describe, expect, jest, test } from "@jest/globals";

import { NewsletterServicesFaker } from "../doubles/infra/services/faker-newsletter-api.js";
import { NodemailerAdapterStub } from "../doubles/infra/services/mailer/send-email.js";

import { SendNewsletterInputDTO } from "../../services/dto/send-newsletter.js";
import { SendNewsletterEmailService } from "../../services/send-newsletter.service.js"
import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { HtmlTemplateEngineAdapterFaker } from "../doubles/infra/template-adapter.js";

function makeNewsletter(id) {
  return {
    Id: id,
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
  }
}

describe("# Send Newsletter", () => {
  test("When newsletter already exists then should be able to send email", async () => {
    const newsletterToSend = makeNewsletter(1);

    const subscribers = [
      {
        Email: "test1@gmail.com",
        Code: 'asdasdasd12'
      }
    ];

    const newsletterService = new NewsletterServicesFaker(
      [newsletterToSend],
      subscribers
    );

    const sendEmailService = new NodemailerAdapterStub();
    const htmlTemplateEngine = new HtmlTemplateEngineAdapterFaker();

    const sendEmailServiceWatch = jest.spyOn(sendEmailService, "send");
    const updateNewsletterSendAtServiceWatch = jest.spyOn(newsletterService, "updateNewsletterSendAt");

    const sendNewsletter = new SendNewsletterEmailService(
      newsletterService,
      sendEmailService,
      htmlTemplateEngine
    );

    const result = await sendNewsletter.execute(new SendNewsletterInputDTO({
      id: newsletterToSend.Id,
      title: newsletterToSend.Title,
      description: newsletterToSend.Description,
      content: newsletterToSend.Data
    }));

    expect(sendEmailServiceWatch).toBeCalledTimes(1);

    expect(updateNewsletterSendAtServiceWatch).toBeCalledTimes(1);

    expect(result.isSuccess()).toBeTruthy();
    expect(result.data).toBe("Sucesso ao enviar notícia");
  });

  test("When news is not exists should'n be able to send newsletter emails", async () => {
    const subscribers = [
      {
        Email: "test1@gmail.com",
        Code: 'asdasdasd12'
      }
    ];

    const newsletterService = new NewsletterServicesFaker([], subscribers);

    const sendEmailService = new NodemailerAdapterStub();
    const sendEmailServiceWatch = jest.spyOn(sendEmailService, "send");

    const sendNewsletter = new SendNewsletterEmailService(
      newsletterService,
      sendEmailService,
      new HtmlTemplateEngineAdapterFaker()
    );

    const result = await sendNewsletter.execute(new SendNewsletterInputDTO({
      id: 87,
      title: "",
      description: "",
      content: ""
    }));

    expect(result.isSuccess()).toBeFalsy();
    expect(result.err.message).toBe(`Notícia não existe`);
    expect(sendEmailServiceWatch).toBeCalledTimes(0);
  });

  test("When subscriber is not exists should be able to send newsletter to default emails", async () => {
    const newsletterToSend = makeNewsletter(1);

    const newsletterService = new NewsletterServicesFaker([newsletterToSend]);

    const sendEmailService = new NodemailerAdapterStub();

    const sendNewsletter = new SendNewsletterEmailService(
      newsletterService,
      sendEmailService,
      new HtmlTemplateEngineAdapterFaker()
    );

    const result = await sendNewsletter.execute(new SendNewsletterInputDTO({
      id: newsletterToSend.Id,
      title: newsletterToSend.Title,
      description: newsletterToSend.Description,
      content: newsletterToSend.Data
    }));

    expect(result.isError()).toBeFalsy();
    // expect(result.error().message).toBe("Deve haver no mínimo um destinatário");
  });
});
