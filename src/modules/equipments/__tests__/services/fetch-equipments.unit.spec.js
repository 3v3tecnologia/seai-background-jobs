// npm run test:dev -i __tests__/units/services/funceme/fetch-funceme-stations-measures.spec.js

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import { EquipmentCommand } from "../../services/commands/command.js";

import { FetchFuncemeEquipments } from "../../data/funceme/services/fetch-funceme-measures.js";
import { FetchEquipments } from "../../services/equipments/fetch-equipments.js";
import { FTPClientAdapterMock } from "../doubles/infra/ftp/ftp-stub.js";
import { EquipmentsServicesFaker } from "../doubles/infra/services/equipments.js";
// Domain Model

describe("Fetch Equipments", () => {
  const ftpClientAdapter = new FTPClientAdapterMock();
  let equipmentsServicesFaker;

  function makeFetchFuncemeEquipments(equipmentsServices) {
    return new FetchFuncemeEquipments(ftpClientAdapter, equipmentsServices);
  }

  function makeSUT(equipmentsServices) {
    return new FetchEquipments(
      makeFetchFuncemeEquipments(equipmentsServices),
      equipmentsServices
    );
  }

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

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test("should be able to fetch equipments", async () => {
    jest.setSystemTime(new Date(2023, 9, 2));

    const sut = makeSUT(equipmentsServicesFaker);

    const dataOrError = await sut.execute(new EquipmentCommand());

    expect(dataOrError.isSuccess()).toBeTruthy();

    const { stations, pluviometers } = dataOrError.value();

    expect(stations.length).toBeGreaterThan(0);
    expect(pluviometers.length).toBeGreaterThan(0);
  });

  test("should be able to save equipments", async () => {
    jest.setSystemTime(new Date(2023, 9, 2));

    const equipments = [
      {
        Id: 1696215600000,
        Code: "B8522B7C",
        Name: "São Gonçalo do Amarante - Jardim Botânico",
        Altitude: "25.0",
        Location: { Latitude: "-3.57055", Longitude: "-38.886972222222205" },
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

    const result = await sut.execute(new EquipmentCommand());

    expect(result.isSuccess()).toBeTruthy();
    expect(result.value()).toBe("Sucesso ao carregar equipamentos");
  });
});
