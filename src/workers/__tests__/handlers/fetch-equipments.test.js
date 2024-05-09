// import {
//   afterEach,
//   beforeEach,
//   describe,
//   expect,
//   jest,
//   test,
// } from "@jest/globals";

import { FetchFuncemeMeasurementsWorker,FetchFuncemeEquipmentsWorker } from "../../handlers/funceme/index.js";

async function runner() {
  await FetchFuncemeEquipmentsWorker.handler();
}

runner();
