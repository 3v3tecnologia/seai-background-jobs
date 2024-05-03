// node --experimental-vm-modules node_modules/jest/bin/jest.js --watchAll -i ./src/modules/equipments/__tests__/services/fetch-measurements.unit.spec.js
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import { EquipmentsServicesFaker } from "../doubles/infra/services/equipments.js";
import { CalcEt0ByEquipmentsMeasurementsStub } from "../doubles/infra/services/calc-et0-stub.js";

import { FTPClientAdapterMock } from "../doubles/infra/ftp/ftp-stub.js";

import { EquipmentCommand } from "../../services/commands/command.js";

import { FetchEquipmentsMeasures } from "../../services/measurements/fetch-measurements.js";

import { FetchFuncemeEquipments } from "../../data/funceme/services/fetch-funceme-measures.js";

describe("Fetch Equipments", () => {
  const ftpClientAdapter = new FTPClientAdapterMock();
  let equipmentsServicesFaker;

  beforeEach(() => {
    jest.useFakeTimers("modern");

    equipmentsServicesFaker = new EquipmentsServicesFaker();

    jest
      .spyOn(ftpClientAdapter, "getFolderContentDescription")
      .mockImplementation(async (folder) => {
        return new Promise((resolve, reject) => {
          if (folder === "pcds") {
            return resolve([{ name: "stn_data_2023.tar.gz" }]);
          }

          return resolve([{ name: "prec_data_2023.tar.gz" }]);
        });
      });
  });

  function makeSUT(equipmentsServices) {
    const fetchFuncemeEquipments = new FetchFuncemeEquipments(
      ftpClientAdapter,
      equipmentsServices
    );

    return new FetchEquipmentsMeasures(
      fetchFuncemeEquipments,
      equipmentsServices,
      new CalcEt0ByEquipmentsMeasurementsStub()
    );
  }

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test.skip("Should be able to fetch equipments measurements and save only measurements from already registered equipment", async () => {
    jest.setSystemTime(new Date(2023, 9, 2));

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

    equipmentsServicesFaker.equipmentList = equipments;

    const sut = makeSUT(equipmentsServicesFaker);

    const response = await sut.execute(new EquipmentCommand());

    expect(response.isSuccess()).toBeTruthy();
    expect(response.value()).toBe("Sucesso ao salvar medições de equipamentos");
  });

  test("Given that equipments measurements already persisted then should be able to update measurements", async () => {
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

    equipmentsServicesFaker.stationsMeasurementsList = stationsMeasurements;

    const pluviometersMeasurements = [
      {
        Value: 0,
        Time: "2023-10-01",
        FK_Equipment: 1994225630000,
        FK_Organ: 1,
      },
    ];

    equipmentsServicesFaker.pluviometersMeasurementsList =
      pluviometersMeasurements;

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

    equipmentsServicesFaker.equipmentList = equipments;

    const sut = makeSUT(equipmentsServicesFaker);

    const result = await sut.execute(new EquipmentCommand());

    expect(result.isSuccess()).toBeTruthy();
    expect(result.value()).toBe("Sucesso ao salvar medições de equipamentos");
  });
});
