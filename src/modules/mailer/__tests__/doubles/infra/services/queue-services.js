export class QueueServicesFaker {
  async nack(queue) {
    throw new Error("Not implemented");
  }

  async startQueueMonitoring() {
    Logger.info({
      msg: "[🔍] Iniciando monitoramento de jobs",
    });
    // Prepares the target database and begins job monitoring.

    Logger.info({
      msg: "[✅] Monitoramento iniciado com sucesso",
    });
  }

  async schedule(name_queue, cron, data, options) {}

  async fetch(name_queue, qtd) {}

  async enqueue(name_queue, data, options) {}

  async registerWorker(queue, worker) {}
}
