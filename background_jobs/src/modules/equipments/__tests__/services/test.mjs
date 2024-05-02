import "dotenv/config.js";
console.log(process.env);
import { FetchFuncemeMeasurementsWorker } from "../../../../workers/handlers/index.js";


(async function(){
    await FetchFuncemeMeasurementsWorker.handler()
})()