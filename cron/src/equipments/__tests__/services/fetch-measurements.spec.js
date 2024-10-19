// node --experimental-vm-modules node_modules/jest/bin/jest.js --watchAll -i ./src/modules/equipments/__tests__/services/fetch-measurements.unit.spec.js
import { beforeEach, describe, expect, jest, test } from "@jest/globals";

import { ftpClientFaker } from "../doubles/infra/ftp/ftp-client.js";

import { EquipmentCommand } from "../../services/commands/command.js";

import { FetchEquipmentsMeasures } from "../../services/measurements/fetch-measurements.js";

import { FetchFuncemeEquipments } from "../../data/funceme/services/funceme.js";
import { EquipmentsServicesFaker } from "../doubles/infra/services/equipments.js";
import { EQUIPMENT_TYPE } from "../../core/equipments-types.js";

describe.skip("Fetch Equipment Measurements from meteorological entity", () => {
  function makeSUT(
    equipmentsServices,
    fetchEquipmentsFromMeteorologicalEntity
  ) {
    return new FetchEquipmentsMeasures(
      fetchEquipmentsFromMeteorologicalEntity,
      equipmentsServices
    );
  }

  function checkStationMeasurementsProperties(measurements, toMatch) {
    expect(measurements).toHaveProperty("Time");
    expect(measurements.Time).toStrictEqual(toMatch.date);
    expect(measurements.FK_Organ).toStrictEqual(toMatch.organ);
    expect(measurements).toHaveProperty("AverageAtmosphericTemperature");
    expect(measurements).toHaveProperty("MaxAtmosphericTemperature");
    expect(measurements).toHaveProperty("MinAtmosphericTemperature");
    expect(measurements).toHaveProperty("AverageRelativeHumidity");
    expect(measurements).toHaveProperty("MaxRelativeHumidity");
    expect(measurements).toHaveProperty("MinRelativeHumidity");
    expect(measurements).toHaveProperty("AtmosphericPressure");
    expect(measurements).toHaveProperty("WindVelocity");
    expect(measurements).toHaveProperty("TotalRadiation");
    expect(measurements).toHaveProperty("FK_Equipment");
    expect(measurements).toHaveProperty("FK_Organ");
    expect(measurements).toHaveProperty("Altitude");
    expect(measurements).toHaveProperty("Longitude");
    expect(measurements).toHaveProperty("Latitude");
  }
  function checkPluviometerMeasurementsProperties(measurements, toMatch) {
    expect(measurements).toHaveProperty("Time");
    expect(measurements.Time).toStrictEqual(toMatch.date);
    expect(measurements.FK_Organ).toStrictEqual(toMatch.organ);
    expect(measurements).toHaveProperty("Pluviometry");
    expect(measurements).toHaveProperty("FK_Equipment");
    expect(measurements).toHaveProperty("FK_Organ");
    expect(measurements).toHaveProperty("Altitude");
    expect(measurements).toHaveProperty("Longitude");
    expect(measurements).toHaveProperty("Latitude");
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

  describe("Given that equipment was previously registered in the database", () => {
    test("When there are stations then it must be able to obtain measurements by station codes", async () => {
      jest.setSystemTime(new Date(2023, 5, 22));

      const stationsEquipments = [
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
        equipmentList: stationsEquipments,
      });

      const fetchEquipmentsFromMeteorologicalEntity =
        new FetchFuncemeEquipments(ftpClientFaker, equipmentsServices);

      const sut = makeSUT(
        equipmentsServices,
        fetchEquipmentsFromMeteorologicalEntity
      );

      const insertMeasurementsSpy = jest.spyOn(
        equipmentsServices,
        "bulkInsertMeasurements"
      );

      const command = new EquipmentCommand();

      const response = await sut.execute(command);

      expect(insertMeasurementsSpy).toHaveBeenCalledTimes(1);

      const args = insertMeasurementsSpy.mock.calls[0];

      const stationsToBeRecorded = args[0];

      expect(stationsToBeRecorded.type).toStrictEqual(EQUIPMENT_TYPE.STATION);

      stationsToBeRecorded.items.forEach((item) => {
        checkStationMeasurementsProperties(item, {
          date: command.getDate(),
          organ: 1,
        });
      });

      expect(response.isSuccess()).toBeTruthy();
      expect(response.value()).toBe(
        "Sucesso ao salvar medições de equipamentos"
      );
    });
    test("When there are pluviometers then it must be able to obtain measurements by pluviometer codes", async () => {
      jest.setSystemTime(new Date(2023, 5, 22));

      const stationsEquipments = [
        {
          Id: 1496215600000,
          Code: "24120",
          Name: "TIANGUA",
          Altitude: null,
          Location: {
            Latitude: "-40.9924166667",
            Longitude: "-3.72580555556",
          },
          Type: 2,
          Organ: "FUNCEME",
          Id_Organ: 1,
          Enabled: false,
        },
      ];

      const equipmentsServices = new EquipmentsServicesFaker({
        equipmentList: stationsEquipments,
      });

      const fetchEquipmentsFromMeteorologicalEntity =
        new FetchFuncemeEquipments(ftpClientFaker, equipmentsServices);

      const sut = makeSUT(
        equipmentsServices,
        fetchEquipmentsFromMeteorologicalEntity
      );

      const insertMeasurementsSpy = jest.spyOn(
        equipmentsServices,
        "bulkInsertMeasurements"
      );

      const command = new EquipmentCommand();

      const response = await sut.execute(command);

      expect(insertMeasurementsSpy).toHaveBeenCalledTimes(1);

      const args = insertMeasurementsSpy.mock.calls[0];

      const stationsToBeRecorded = args[0];

      expect(stationsToBeRecorded.type).toStrictEqual(
        EQUIPMENT_TYPE.PLUVIOMETER
      );

      stationsToBeRecorded.items.forEach((item) => {
        checkPluviometerMeasurementsProperties(item, {
          date: command.getDate(),
          organ: 1,
        });
      });

      expect(response.isSuccess()).toBeTruthy();
      expect(response.value()).toBe(
        "Sucesso ao salvar medições de equipamentos"
      );
    });
  });

  describe("Equipment was not previously registered in the database", () => {
    test("Given that equipments does not exists then shouldn't be able to save measurements", async function () {
      jest.setSystemTime(new Date(2023, 9, 2));

      const equipments = [];

      const equipmentsServices = new EquipmentsServicesFaker({
        equipmentList: equipments,
      });

      const fetchEquipmentsFromMeteorologicalEntity =
        new FetchFuncemeEquipments(ftpClientFaker, equipmentsServices);

      const sut = makeSUT(
        equipmentsServices,
        fetchEquipmentsFromMeteorologicalEntity
      );

      const response = await sut.execute(new EquipmentCommand());

      expect(response.isError()).toBeTruthy();
      expect(response.error().message).toBe("Não há equipamentos cadastrados");
    });
  });

  describe("Meteorological entity does not exist", () => {
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

      const fetchEquipmentsFromMeteorologicalEntity =
        new FetchFuncemeEquipments(ftpClientFaker, equipmentsServices);

      const sut = makeSUT(
        equipmentsServices,
        fetchEquipmentsFromMeteorologicalEntity
      );

      const response = await sut.execute(new EquipmentCommand());

      expect(response.isError()).toBeTruthy();
      expect(response.error()).toBe("Server disabled");
    });
  });
});
