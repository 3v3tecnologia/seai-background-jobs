// node --experimental-vm-modules node_modules/jest/bin/jest.js --watchAll -i ./src/modules/equipments/__tests__/services/fetch-measurements.unit.spec.js
import { beforeEach, describe, expect, jest, test } from "@jest/globals";

import { ftpClientFaker } from "../doubles/infra/ftp/ftp-client.js";

import { EquipmentCommand } from "../../services/commands/command.js";

import { FetchEquipmentsMeasures } from "../../services/measurements/fetch-measurements.js";

import { FetchFuncemeEquipments } from "../../data/funceme/services/fetch-funceme-measures.js";
import { EquipmentsServicesFaker } from "../doubles/infra/services/equipments.js";
import { EQUIPMENT_TYPE } from "../../core/equipments-types.js";

describe.skip("Fetch Equipments Measurements", () => {
  function makeSUT(
    equipmentsServices,
    fetchEquipmentsFromMeteorologicalEntity
  ) {
    return new FetchEquipmentsMeasures(
      fetchEquipmentsFromMeteorologicalEntity,
      equipmentsServices
    );
  }

  beforeEach(() => {
    jest.useFakeTimers("modern");
  });

  // afterEach(() => {
  //   jest.useRealTimers();
  //   jest.resetAllMocks();
  // });

  // afterAll(()=>{
  //   jest.restoreAllMocks();
  // })

  test("Given that exists station equipments then should be able to save only measurements from already registered equipments", async () => {
    jest.setSystemTime(new Date(2023, 9, 2));

    const equipments = [
      {
        Id: 1496215600000,
        Code: "A354",
        Name: "OEIRAS",
        Altitude: "154.03",
        Location: { Latitude: "-6.974135", Longitude: "-42.146831" },
        Type: 1,
        Organ: "FUNCEME",
        Id_Organ: 1,
        Enabled: false,
      },
      {
        Id: 1696215600000,
        Code: "B8531C1C",
        Name: "Quixerê",
        Altitude: "132.0",
        Location: {
          Latitude: "-5.0838888888889",
          Longitude: "-37.856666666666996",
        },
        Type: 1,
        Organ: "FUNCEME",
        Id_Organ: 1,
        Enabled: false,
      },
    ];

    const equipmentsServices = new EquipmentsServicesFaker({
      equipmentList: equipments,
    });

    const fetchEquipmentsFromMeteorologicalEntity = new FetchFuncemeEquipments(
      ftpClientFaker,
      equipmentsServices
    );

    const sut = makeSUT(
      equipmentsServices,
      fetchEquipmentsFromMeteorologicalEntity
    );

    const insertMeasurementsSpy = jest.spyOn(
      equipmentsServices,
      "bulkInsertMeasurements"
    );

    const response = await sut.execute(new EquipmentCommand());

    expect(insertMeasurementsSpy).toHaveBeenCalledTimes(1);

    const args = insertMeasurementsSpy.mock.calls[0];

    expect(args[0]).toStrictEqual(EQUIPMENT_TYPE.STATION);
    expect(args[1]).toMatchObject([
      {
        Time: "2023-10-01",
        AverageAtmosphericTemperature: 30.23,
        MaxAtmosphericTemperature: 31.65,
        MinAtmosphericTemperature: 29.08,
        AverageRelativeHumidity: 30.04,
        MaxRelativeHumidity: 33.21,
        MinRelativeHumidity: 26.83,
        AtmosphericPressure: 992.46,
        WindVelocity: 99.72,
        TotalRadiation: null,
        FK_Equipment: 1496215600000,
        FK_Organ: 1,
        Altitude: "154.03",
        Longitude: "-42.146831",
        Latitude: "-6.974135",
      },
      {
        Time: "2023-10-01",
        AverageAtmosphericTemperature: 28.61,
        MaxAtmosphericTemperature: 29.45,
        MinAtmosphericTemperature: 27.79,
        AverageRelativeHumidity: 60.61,
        MaxRelativeHumidity: 64.22,
        MinRelativeHumidity: 58.32,
        AtmosphericPressure: 994.6,
        WindVelocity: 3.42,
        TotalRadiation: 335.35,
        FK_Equipment: 1696215600000,
        FK_Organ: 1,
        Altitude: "132.0",
        Longitude: "-37.856666666666996",
        Latitude: "-5.0838888888889",
      },
    ]);

    expect(response.isSuccess()).toBeTruthy();
    expect(response.value()).toBe("Sucesso ao salvar medições de equipamentos");
  });

  test("Given that equipments does not exists then shouldn't be able to save measurements", async function () {
    jest.setSystemTime(new Date(2023, 9, 2));

    const equipments = [];

    const equipmentsServices = new EquipmentsServicesFaker({
      equipmentList: equipments,
    });

    const fetchEquipmentsFromMeteorologicalEntity = new FetchFuncemeEquipments(
      ftpClientFaker,
      equipmentsServices
    );

    const sut = makeSUT(
      equipmentsServices,
      fetchEquipmentsFromMeteorologicalEntity
    );

    const response = await sut.execute(new EquipmentCommand());

    expect(response.isError()).toBeTruthy();
    expect(response.error().message).toBe("Não há equipamentos cadastrados");
  });

  test("Given that is not possible to get measurements from meteorological entity then a error should be created", async function () {
    jest.setSystemTime(new Date(2023, 9, 2));

    const equipments = [
      {
        Id: 1496215600000,
        Code: "A354",
        Name: "OEIRAS",
        Altitude: "154.03",
        Location: { Latitude: "-6.974135", Longitude: "-42.146831" },
        Type: 1,
        Organ: "FUNCEME",
        Id_Organ: 1,
        Enabled: false,
      },
    ];

    const equipmentsServices = new EquipmentsServicesFaker({
      equipmentList: equipments,
    });

    jest
      .spyOn(ftpClientFaker, "connect")
      .mockRejectedValue(new Error("Server disabled"));

    const fetchEquipmentsFromMeteorologicalEntity = new FetchFuncemeEquipments(
      ftpClientFaker,
      equipmentsServices
    );

    const sut = makeSUT(
      equipmentsServices,
      fetchEquipmentsFromMeteorologicalEntity
    );

    const response = await sut.execute(new EquipmentCommand());

    expect(response.isError()).toBeTruthy();
    expect(response.error()).toBe("Server disabled");
  });

  // To Review
  test.skip("Given that equipments measurements already persisted then should be able to update measurements", async () => {
    jest.setSystemTime(new Date(2023, 9, 2));

    const stationsMeasurements = [
      {
        TotalRadiation: null,
        MaxRelativeHumidity: 33.21,
        MinRelativeHumidity: 26.83,
        AverageRelativeHumidity: 30.04,
        MaxAtmosphericTemperature: 31.65,
        MinAtmosphericTemperature: 29.08,
        AverageAtmosphericTemperature: 30.23,
        AtmosphericPressure: 992.46,
        WindVelocity: 99.72,
        Et0: null,
        Time: "2023-10-01",
        FK_Equipment: 1696215600000,
        FK_Organ: 1,
      },
      {
        TotalRadiation: 335.35,
        MaxRelativeHumidity: 64.22,
        MinRelativeHumidity: 58.32,
        AverageRelativeHumidity: 60.61,
        MaxAtmosphericTemperature: 29.45,
        MinAtmosphericTemperature: 27.79,
        AverageAtmosphericTemperature: 28.61,
        AtmosphericPressure: 994.6,
        WindVelocity: 3.42,
        Et0: 6.354057931957724,
        Time: "2023-10-01",
        FK_Equipment: 1696215630000,
        FK_Organ: 1,
      },
    ];

    const pluviometersMeasurements = [
      {
        Value: 0,
        Time: "2023-10-01",
        FK_Equipment: 1994225630000,
        FK_Organ: 1,
      },
    ];

    const equipments = [
      {
        Id: 1696215600000,
        Code: "A354",
        Name: "OEIRAS",
        Altitude: "154.03",
        Location: { Latitude: "-6.974135", Longitude: "-42.146831" },
        Type: 1,
        Organ: "FUNCEME",
        Id_Organ: 1,
        Enabled: false,
      },
      {
        Id: 1696215630000,
        Code: "B8531C1C",
        Name: "Quixerê",
        Altitude: "132.0",
        Location: {
          Latitude: "-5.0838888888889",
          Longitude: "-37.856666666666996",
        },
        Type: 1,
        Organ: "FUNCEME",
        Id_Organ: 1,
        Enabled: false,
      },
      {
        Id: 1994225630000,
        Code: "24116",
        Name: "SOLONOPOLE",
        Altitude: null,
        Location: {
          Latitude: "-5.73369444444",
          Longitude: "-39.0069444444",
        },
        Type: 2,
        Organ: "FUNCEME",
        Id_Organ: 1,
        Enabled: false,
      },
    ];

    const sut = makeSUT(equipmentsServices);

    const result = await sut.execute(new EquipmentCommand());

    expect(result.isSuccess()).toBeTruthy();
    expect(result.value()).toBe("Sucesso ao salvar medições de equipamentos");
  });
});
