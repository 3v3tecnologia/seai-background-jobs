//  npm run test:unit -i src/modules/mailer/__tests__/services/send-irrigation-mail.spec.js
import { beforeAll, describe, expect, jest, test } from "@jest/globals";

import getTemplateModule from "../../helpers/getTemplateFile.js";
import { SendEmailDummy } from "../doubles/services/send-email-dummy.js";

import { FileNotFoundError } from "../../errors/FileNotFound.js";

import { Left } from "../../../../shared/result.js";
import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { SendUserIrrigationMailInputDTO } from "../../services/dto/send-user-irrigation-mail.js";
import { SendUserIrrigationMailService } from "../../services/send-user-irrigation-mail.service.js";

describe("#Send irrigation mail service", () => {
  let sendEmailService = null;
  let htmlTemplateCompiler = null;
  let sendUserIrrigationMailService = null;

  beforeAll(() => {
    sendEmailService = new SendEmailDummy();
    htmlTemplateCompiler = new HtmlTemplateEngineAdapter();

    sendUserIrrigationMailService = new SendUserIrrigationMailService(
      sendEmailService,
      htmlTemplateCompiler
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should be returned an error if template name is invalid", async function () {
    const dto = new SendUserIrrigationMailInputDTO({
      Name: "irrigant_test",
      Email: "irrigant@gmail.com.br",
      Irrigation: [],
      Notification: null,
    });

    const mock = jest
      .spyOn(getTemplateModule, "getTemplate")
      .mockImplementation(() => { throw new FileNotFoundError() })

    const resultOrError = await sendUserIrrigationMailService.execute(dto);

    expect(resultOrError.isError()).toBeTruthy();
    expect(resultOrError.err).toBeInstanceOf(FileNotFoundError);
    mock.mockRestore(); // restore getTemplate
  });

  test("When has calculated irrigation recommendations then should be sent an email to the user", async function () {
    const dto = new SendUserIrrigationMailInputDTO({
      Name: "irrigant_test",
      Email: "irrigant@gmail.com.br",
      Irrigation: [
        {
          Id: 1,
          Crop: {
            Id: 1,
            Name: "crop",
            Etc: 1,
            Kc: 1,
            IrrigationTime: 1,
            CropDays: 1,
            RepositionBlade: 1,
            Stage: 1,
            PlantingDate: "DD/MM/YYYY",
          },
          Equipments: {
            Et0: 1,
            Precipitation: 1,
          },
          System: {
            IrrigationEfficiency: 1,
          },
          Created_at: new Date().toISOString(),
          Updated_at: new Date().toISOString(),
        },
      ],
      Notification: null,
    });

    const sendEmailMethodMock = jest.spyOn(sendEmailService, "send");

    const resultOrError = await sendUserIrrigationMailService.execute(dto);

    expect(resultOrError.isError()).toBeFalsy();
    expect(resultOrError.isSuccess()).toBeTruthy();
    expect(resultOrError.data).toStrictEqual(
      `Sucesso ao enviar email de recomendação de lâmina do usuário ${dto.getName()}`
    );

    expect(sendEmailMethodMock).toBeCalled();

    const sendEmailArg = sendEmailMethodMock.mock.calls[0][0];

    expect(sendEmailArg.from).toStrictEqual("testseaimailer@gmail.com");
    expect(sendEmailArg.to).toStrictEqual(dto.getEmail());
    expect(sendEmailArg.subject).toStrictEqual("SEAI - Recomendação de lâmina");
  });

  test("When there are no calculated irrigation recommendations then should be sent an email to the user with the notification column", async function () {
    const dto = new SendUserIrrigationMailInputDTO({
      Name: "irrigant_test",
      Email: "irrigant@gmail.com.br",
      Irrigation: [
        {
          Id: 1,
          Crop: {
            Id: 1,
            Name: "crop",
            Etc: null,
            Kc: null,
            IrrigationTime: null,
            CropDays: null,
            RepositionBlade: null,
            Stage: null,
            PlantingDate: "DD/MM/YYYY",
          },
          Equipments: {
            Et0: null,
            Precipitation: null,
          },
          System: {
            IrrigationEfficiency: 1,
          },
          Created_at: new Date().toISOString(),
          Updated_at: new Date().toISOString(),
        },
      ],
      Notification: "Fail",
    });

    const sendEmailMethodMock = jest.spyOn(sendEmailService, "send");

    const resultOrError = await sendUserIrrigationMailService.execute(dto);

    expect(resultOrError.isError()).toBeFalsy();
    expect(resultOrError.isSuccess()).toBeTruthy();
    expect(resultOrError.data).toStrictEqual(
      `Sucesso ao enviar email de recomendação de lâmina do usuário ${dto.getName()}`
    );

    expect(sendEmailMethodMock).toBeCalled();

    const sendEmailArg = sendEmailMethodMock.mock.calls[0][0];

    expect(sendEmailArg.html).toContain("<h1>Fail</h1>");
    expect(sendEmailArg.from).toStrictEqual("testseaimailer@gmail.com");
    expect(sendEmailArg.to).toStrictEqual(dto.getEmail());
    expect(sendEmailArg.subject).toStrictEqual("SEAI - Recomendação de lâmina");
  });
});
