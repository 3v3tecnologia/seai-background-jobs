import zlib from "zlib";
import tar from "tar-stream";

import { pipeline } from "stream/promises";

function convertCompressedFileStream(tarballStream) {
  const results = []; // [fileName] : Buffer
  return new Promise(async (resolve, reject) => {
    const extract = tar.extract();

    extract.on("entry", async function (header, stream, next) {
      let chunks = "";
      // Semelhante ao stream.on('data',()=>{})
      for await (let chunk of stream) {
        chunks += chunk.toString();
      }

      //Transforma array de buffers em um único buffer
      results.push(chunks);
      next();
    });

    extract.on("finish", function () {
      resolve(results);
    });

    await pipeline(tarballStream, zlib.createUnzip(), extract);
  });
}

export { convertCompressedFileStream };
