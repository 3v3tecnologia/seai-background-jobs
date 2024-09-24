//  npm run test:unit:debug  -i src/modules/mailer/__tests__/handler/irrigation_mailer_scheduler.spec.js
import { beforeAll, describe, expect, jest, test } from "@jest/globals";
import { IrrigationMailerScheduler } from "../../handler/irrigation_mailer_scheduler.js";
import { IrrigationRecommendationsServiceFaker } from "../doubles/infra/services/irrigation.service.js";
import { QueueServicesFaker } from "../doubles/infra/services/queue-services.js";

describe("#Irrigation mailer scheduler", () => {
  let queueServicesFaker = new QueueServicesFaker();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Given that exists a user with irrigation recommendations then should schedule irrigation mail", async function () {
    const userIrrigations = {
      Name: "irrigant",
      Email: "davi2@3v3.com.br",
      Irrigation: [],
    };

    const irrigationRecommendationsServiceFaker =
      new IrrigationRecommendationsServiceFaker([userIrrigations]);

    const sut = new IrrigationMailerScheduler(
      irrigationRecommendationsServiceFaker,
      queueServicesFaker
    );

    const sendToQueueMock = jest.spyOn(queueServicesFaker, "enqueue");
    await sut.handle();

    expect(sendToQueueMock).toHaveBeenCalledTimes(1);
    expect(sendToQueueMock).toHaveBeenCalledWith(
      "irrigation-reports",
      JSON.stringify(userIrrigations)
    );
  });

  test("Given that user not exists shouldn't schedule irrigation mail", async function () {
    const irrigationRecommendationsServiceFaker =
      new IrrigationRecommendationsServiceFaker();

    const sut = new IrrigationMailerScheduler(
      irrigationRecommendationsServiceFaker,
      queueServicesFaker
    );

    const sendToQueueMock = jest.spyOn(queueServicesFaker, "enqueue");

    await sut.handle();

    expect(sendToQueueMock).not.toHaveBeenCalled();
  });
});
