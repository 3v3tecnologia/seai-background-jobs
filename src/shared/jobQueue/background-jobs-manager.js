import { Logger } from "../../../shared/logger.js";

export class BackgroundJobsManager {
  static client = null;

  static async registerAllWorkers(queue_jobs = []) {
    Logger.info({ msg: "[⚡] Iniciando workers..." });

    for (const task of queue_jobs) {
      for (const worker of task.workers) {
        await BackgroundJobsManager.registerWorker(task.queue_name, worker);
      }
    }

    Logger.info({
      msg: "[😉] Sucesso ao iniciar os workers...",
    });
  }

  static async scheduleCronJobs(jobs = []) {
    Logger.info({
      msg: "Registrando seeds...",
    });

    for (const job of jobs) {
      const { cron, data, options, queue } = job;
      await BackgroundJobsManager.scheduleCronJob(queue, cron, data, options);
    }
  }
}
