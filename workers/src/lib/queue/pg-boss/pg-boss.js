import { jobsDatabaseCredentials } from "../../../config/app.js";
import pgBoss from "pg-boss";
import { QueueProviderProtocol } from "../queue-provider.js";
import { Logger } from "../../logger.js";

export class PgBossAdapter extends QueueProviderProtocol {
    #boss

    constructor() {
        this.#boss = new pgBoss({
            database: jobsDatabaseCredentials.database,
            port: jobsDatabaseCredentials.port,
            host: jobsDatabaseCredentials.host,
            password: jobsDatabaseCredentials.password,
            user: jobsDatabaseCredentials.user,
        });
    }

    async connect() {
        Logger.info({
            msg: "[🔍] Iniciando monitoramento de jobs",
        });

        await this.#boss.start();

        Logger.info({
            msg: "[✅] Monitoramento iniciado com sucesso",
        });
    }

    async assertQueue(queueName, options = { retryLimit: 4, retryDelay: 60000, deadLetter: queueName, retryBackoff: true }) {
        await this.#boss.createQueue(queueName, options)
    }

    async disconnect() {
        await this.#boss.stop()
    }

    async consumeFromQueue(queueName, callback, options = {
        prefetch: 1,
    }) {
        await this.#boss.work(
            queueName,
            {
                batchSize: options.prefetch //Do not give more than one message to a worker at a time
            },
            ([job]) => callback(job.data)
        );
    }
}
