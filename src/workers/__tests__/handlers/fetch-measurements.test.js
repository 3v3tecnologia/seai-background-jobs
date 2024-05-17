// import {
//   afterEach,
//   beforeEach,
//   describe,
//   expect,
//   jest,
//   test,
// } from "@jest/globals";

import { FetchFuncemeMeasurementsWorker } from "../../handlers/funceme/index.js";

async function runner() {
  await FetchFuncemeMeasurementsWorker.handler();
}

runner();
