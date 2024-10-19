import { createReadStream } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";

const FILES = {
  STATION: "stn_data_2023.tar.gz",
  PLUVIOMETER: "prec_data_2023.tar.gz",
};

class FTPClientAdapterStub {
  close() {
    return new Promise((resolve) => {
      resolve();
    });
  }

  async status() {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  async connect() {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  async getFolderContentDescription(folder) {
    return new Promise((resolve, reject) => {
      if (folder === "pcds") {
        return resolve([{ name: FILES.STATION }]);
      }

      return resolve([{ name: FILES.PLUVIOMETER }]);
    });
  }

  getFile(folder, file) {
    console.log(
      "Reading file from : ",
      pathToFileURL(import.meta.url).pathname
    );
    console.log(`[🔍] Getting stream from path ${folder}/${file}`);
    return createReadStream(
      resolve(
        "src",
        "modules",
        "equipments",
        "__tests__",
        "doubles",
        "__mocks__",
        "ftp-files",
        folder,
        file
      )
    );
  }
}

const ftpClientFaker = new FTPClientAdapterStub();

export { ftpClientFaker };
