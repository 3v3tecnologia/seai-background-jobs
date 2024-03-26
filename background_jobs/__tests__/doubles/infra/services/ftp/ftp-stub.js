import { createReadStream } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";

class FTPClientAdapterMock {
  constructor() {
    this.connection = {};
  }

  async close() {
    return new Promise((resolve) => {
      console.log("Closing connection...");
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
        return resolve([{ name: "stn_data_2023.tar.gz" }]);
      }

      resolve([{ name: "prec_data_2023.tar.gz" }]);
    });
  }

  getFile(folder, file) {
    console.log(
      "Reading file from : ",
      pathToFileURL(import.meta.url).pathname
    );
    console.log(`[🔍] Getting stream from path ${folder}/${file}`);
    return createReadStream(
      // "background_jobs",
      resolve("__tests__", "doubles", "funceme", "data", folder, file)
    );
  }
}

export { FTPClientAdapterMock };
