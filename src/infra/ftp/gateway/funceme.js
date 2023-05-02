import {
  StationParser,
  PluviometerParser,
  convertCompressedFileStream,
} from "../../../utils/index.js";

import dataMinerConfig from '../../../config/funcemeDataMiner.js'

import { FuncemeMap } from "../../../core/mappers/funceme/funcemeMap.js";

class FuncemeGateway {
  ftpConnection;

  constructor(ftpClient) {
    this.ftpConnection = ftpClient;
  }

  async connect() {
    await this.ftpConnection.connect();
  }

  async close() {
    await this.ftpConnection.close();
  }

  async checkStatus() {
    return await this.ftpConnection.status();
  }

  async extractCsvFromFile(folder, file) {
    let data = [];

    const compressedFileStream = await this.ftpConnection.getFile(folder, file);

    console.log(`Iniciando extração de dados do diretório ${folder}/${file}`);

    data = await convertCompressedFileStream(compressedFileStream);

    return data;
  }

  async getStationsByCodesAndDate(codes = [], date) {
    
    const rawList = await this.extractCsvFromFile(
      dataMinerConfig.directories.station.folder,
      dataMinerConfig.directories.station.fileName
    );

    if (!rawList) {
      return null;
    }

    const parsedStations = await StationParser.parse(rawList);
    const stations = [];

    for (const parsedStation of parsedStations) {
      if (codes.includes(parsedStation.code)) {
        const { code, name, latitude, longitude, altitude, measures } =
          parsedStation;

        const stationMeasures = measures.find(
          (measure) => measure.data == date
        );

        const station = FuncemeMap.stationToDomain({
          code,
          name,
          organ: "FUNCEME",
          latitude,
          longitude,
          altitude,
          measures: stationMeasures,
        });

        stations.push(station);
      }
    }

    return stations;
  }

  async getPluviometersByCodesAndDate(codes = [], date) {
    const rawList = await this.extractCsvFromFile(
      dataMinerConfig.directories.pluviometer.folder,
      dataMinerConfig.directories.pluviometer.fileName
    );

    if (!rawList) {
      return null;
    }

    const parsedPluviometers = await PluviometerParser.parse(rawList);

    const pluviometers = [];

    for (const parsedPluviometer of parsedPluviometers) {
      if (codes.includes(parsedPluviometer.code)) {
        const { code, name, latitude, longitude, measures } = parsedPluviometer;

        const pluviometerMeasures = measures.find(
          (measure) => measure.data == date
        );

        const pluviometer = FuncemeMap.pluviometerToDomain({
          code,
          name,
          organ: "FUNCEME",
          latitude,
          longitude,
          measures: pluviometerMeasures,
        });

        pluviometers.push(pluviometer);
      }
    }

    return pluviometers;
  }
}

export { FuncemeGateway };
