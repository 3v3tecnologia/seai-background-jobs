export class WorkersManager {
    #queueProvider;
    #workers = new Map();

    constructor(queueProvider) {
        this.#queueProvider = queueProvider;
    }

    set(jobWorker) {
        const workerInstance = new jobWorker(this.#queueProvider);

        this.#workers.set(workerInstance.type, workerInstance);

        return this;
    }

    async startMonitoring() {
        await this.#queueProvider.connect();

        for (const worker of this.#workers.values()) {
            await worker.start();
        }
    }

    async stopMonitoring() {
        await this.#queueProvider.disconnect()
    }

}