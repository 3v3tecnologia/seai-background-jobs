import {
  StationParser,
  PluviometerParser,
  convertCompressedFileStream,
} from "../../../utils/index.js";

import dataMinerConfig from "../../../config/dataMiner.js";

export class FuncemeDataMiner {
  ftpConnection;

  constructor(ftpClient) {
    this.ftpConnection = ftpClient;
  }

  async extractData(folder, file) {
    const compressedFileStream = await this.ftpConnection.getFile(folder, file);

    console.log(`Iniciando extração de dados do diretório ${folder}/${file}`);

    const data = await convertCompressedFileStream(compressedFileStream);

    return data;
  }

  async getStationsByCodesAndDate(codes, date) {
    const rawList = await this.extractData(
      dataMinerConfig.directories.station.folder,
      dataMinerConfig.directories.station.fileName
    );

    const parsedData = await StationParser.parse(rawList);

    const data = [];

    parsedData.forEach((pluviometer) => {
      if (codes.includes(pluviometer.code)) {
        const { code, name, measures } = pluviometer;

        const measure = measures.find((measure) => measure.data == date);

        data.push({
          code,
          name,
          organ: "FUNCEME",
          measures: measure,
        });
      }
    });

    return data;
  }

  async getPluviometersByCodesAndDate(codes, date) {
    const rawList = await this.extractData(
      dataMinerConfig.directories.pluviometer.folder,
      dataMinerConfig.directories.pluviometer.fileName
    );

    const parsedData = await PluviometerParser.parse(rawList);

    const data = [];

    parsedData.forEach((pluviometer) => {
      if (codes.includes(pluviometer.code)) {
        const { code, name, measures } = pluviometer;

        const measure = measures.find((measure) => measure.data == date);

        data.push({
          code,
          name,
          organ: "FUNCEME",
          measures: measure,
        });
      }
    });

    return data;
  }
}
