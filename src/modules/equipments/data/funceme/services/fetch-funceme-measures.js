// Fetch Funceme Equipments Service with last Measurements

import { FUNCEME_FTP_DIRECTORIES } from "../config/funceme-ftp-directories.js";
import { EquipmentParser } from "../parser/index.js";
import { convertCompressedFileStream } from "../external/adapters/unzip/untar-adapter.js";
import { Logger } from "../../../../../shared/logger.js";
import {
  PluviometerWithMeasurementsMapper,
  StationWithMeasurementsMapper,
} from "../../../core/mappers/index.js";
import { Left, Right } from "../../../../../shared/result.js";
import { EQUIPMENT_TYPE } from "../../../core/equipments-types.js";

export class FetchFuncemeEquipments {
  #ftpClient;
  #equipmentsApi;

  constructor(ftpClientAdapter, equipmentsApi) {
    this.#ftpClient = ftpClientAdapter;
    this.#equipmentsApi = equipmentsApi;
    // this.#logger = logger;
  }

  async getLastUpdatedFileName(folder) {
    // Make sure that it finds the most recent folder
    const currentYear = new Date().getFullYear();

    const filesDescriptionsFromFolder =
      await this.#ftpClient.getFolderContentDescription(folder);

    if (filesDescriptionsFromFolder.length === 0) {
      return null;
    }

    // Get the folder that contain the current date
    const fileDescription = filesDescriptionsFromFolder.filter((file) => {
      return file.name.includes(currentYear);
    });

    if (fileDescription.length === 0) {
      return null;
    }

    const { name } = fileDescription[0];

    return name;
  }

  async getFiles(folder) {
    const fileName = await this.getLastUpdatedFileName(folder);

    if (!fileName) {
      return null;
    }

    const compressedStreamOfFiles = await this.#ftpClient.getFile(
      folder,
      fileName
    );

    const files = await convertCompressedFileStream(compressedStreamOfFiles);

    if (files.length) {
      return files;
    }

    console.log(`Não foi possível encontrar arquivos no diretório ${folder}`);

    return null;
  }

  async execute(FetchEquipmentsCommand) {
    try {
      const organName = "FUNCEME";
      Logger.info({
        msg: `Iniciando busca de credenciais de acesso para FTP do órgão ${organName}`,
      });

      // Must be replaced with environment variables
      const meteorologicalOrgan =
        await this.#equipmentsApi.getMeteorologicalOrganCredentials(organName);

      if (meteorologicalOrgan === null) {
        return Left.create(
          new Error(
            `Não foi possível buscar credenciais de acesso do FTP da ${organName}`
          )
        );
      }

      // Start a new Connection to FTP
      await this.#ftpClient.connect({
        host: meteorologicalOrgan.Host,
        user: meteorologicalOrgan.User,
        password: meteorologicalOrgan.Password,
      });

      // Add timeout?
      const [stationLists, pluviometerList] = await Promise.all([
        this.getFiles(FUNCEME_FTP_DIRECTORIES.directories.station.folder),
        this.getFiles(FUNCEME_FTP_DIRECTORIES.directories.pluviometer.folder),
      ]);

      const [parsedStations, parsedPluviometers] = [
        await EquipmentParser.parse(
          stationLists,
          getLastMeasurements(
            FetchEquipmentsCommand.getDate(),
            meteorologicalOrgan.Id
          ),
          StationWithMeasurementsMapper.toDomain
        ),
        await EquipmentParser.parse(
          pluviometerList,
          getLastMeasurements(
            FetchEquipmentsCommand.getDate(),
            meteorologicalOrgan.Id
          ),
          PluviometerWithMeasurementsMapper.toDomain
        ),
      ];

      // If throw error but connection still alive?
      await this.#ftpClient.close();

      const equipments = new Map([
        [EQUIPMENT_TYPE.STATION, parsedStations],
        [EQUIPMENT_TYPE.PLUVIOMETER, parsedPluviometers],
      ]);

      return Right.create({
        organId: meteorologicalOrgan.Id,
        equipments
      });
    } catch (error) {
      // Logger.error({
      //   msg: "Falha ao executar buscar equipamentos da Funceme.",
      //   obj: error,
      // });

      console.error(error);

      // TO-DO: detect when has a connection error
      if (error) {
        await this.#ftpClient.close();
      }

      //Essencial para o PG-BOSS entender que ocorreu um erro
      return Left.create(error.message);
    }
  }
}

// Maybe should be a Util
function getLastMeasurements(date, organId) {
  return function (list) {
    const eqps = [];

    // TO-DO: add mapper
    list.forEach((data) => {
      const measure = data.Measurements.find((measure) => measure.data == date);
      if (measure) {
        // Add mapper to tomain
        eqps.push({
          Code: data.Code,
          Name: data.Name,
          Latitude: data.Latitude,
          Altitude: data.Altitude,
          Longitude: data.Longitude,
          Id_Organ: organId,
          Measurements: measure,
        });
      }
    });

    return eqps;
  };
}
