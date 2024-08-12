// npm run test:dev -i __tests__/units/services/send-account-notification/send-account-notification.spec.js
import { beforeAll, describe, expect, jest, test } from "@jest/globals";

import { SendEmailDummy } from "../doubles/services/send-email-dummy.js";

import { FileNotFoundError } from "../../errors/FileNotFound.js";

import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { SendUserAccountNotificationService } from "../../services/user-account-notification.service.js";

describe("#Send user account notification service", () => {
  let sendEmailService = null;
  let htmlTemplateCompiler = null;
  let sendUserAccountNotification = null;

  beforeAll(() => {
    sendEmailService = new SendEmailDummy();

    htmlTemplateCompiler = new HtmlTemplateEngineAdapter();

    sendUserAccountNotification = new SendUserAccountNotificationService(
      sendEmailService,
      htmlTemplateCompiler
    );
  });

  test("Should be throw error if 'action' not exists in the payload or this value is not expected", async function () {
    const resultOrError = await sendUserAccountNotification.execute({
      email: "test@gmail.com",
      redirect_url: "http://localhost:8080",
      action: 'create'
    });

    expect(resultOrError.isError());
    expect(resultOrError.err).toBeInstanceOf(FileNotFoundError);
  });

  test("Should be throw error if template file not exists", async function () {
    const resultOrError = await sendUserAccountNotification.execute({
      email: "test@gmail.com",
      redirect_url: "TEST",
      action: "yyy",
    });

    expect(resultOrError.isError());
    expect(resultOrError.err).toBeInstanceOf(FileNotFoundError);
  });

  test("Should be able to send create user account email", async function () {
    const sendEmailSpy = jest.spyOn(sendEmailService, "send");

    const resultOrError = await sendUserAccountNotification.execute({
      email: "testinho@gmail.com",
      redirect_url: "http://localhost:8080",
      action: "create-user-account",
    });

    expect(resultOrError.isSuccess());
    expect(resultOrError.data).toBe(
      "Sucesso ao enviar email"
    );

    expect(sendEmailSpy).toBeCalledTimes(1);
  });

  test("Should be able to send forgot user password email", async function () {
    const sendEmailSpy = jest.spyOn(sendEmailService, "send");

    const resultOrError = await sendUserAccountNotification.execute({
      email: "testinho@gmail.com",
      redirect_url: "http://localhost:8080",
      action: "forgot-user-account",
    });

    expect(resultOrError.isSuccess());
    expect(resultOrError.data).toBe(
      "Sucesso ao enviar email"
    );

    expect(sendEmailSpy).toBeCalledTimes(1);
  });

  test("When the email service to throw an error, it must log and return the error", async function () {

    const sendEmailSpy = jest
      .spyOn(sendEmailService, "send")
      .mockRejectedValue(new Error("Error to send email"));

    const resultOrError = await sendUserAccountNotification.execute({
      email: "testinho@gmail.com",
      redirect_url: "http://localhost:8080",
      action: "forgot-user-account",
    });

    expect(resultOrError.isError());
    expect(sendEmailSpy).toBeCalledTimes(1);
  });
});
