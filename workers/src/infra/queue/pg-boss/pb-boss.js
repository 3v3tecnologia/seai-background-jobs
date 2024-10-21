import pgBoss from "pg-boss";
import { QueueProviderProtocol } from "../queue-provider.js";

export class PgBossAdapter extends QueueProviderProtocol {
    constructor(url) {
        super()
        this.url = url;
        this.connection = null;
    }

    async connect() {
        try {
            console.log("[🔍] Iniciando monitoramento de jobs");

            this.connection = new pgBoss(this.url);


            await this.connection.start();

            console.log("[✅] Monitoramento iniciado com sucesso");
        } catch (error) {
            console.error('Error connecting to Pg-boss:', error);
            throw error;
        }
    }

    async assertQueue(queueName, options = { retryLimit: 4, retryDelay: 60000, deadLetter: queueName, retryBackoff: true }) {
        // await this.connection.createQueue(queueName, options)
    }

    async disconnect() {
        if (this.connection) {
            await this.connection.close();
        }
        console.log('Disconnected from MQ...');
    }

    async consumeFromQueue(queueName, callback, options = {
        prefetch: 1,
    }) {
        const result = await this.connection.work(
            queueName,
            {
                batchSize: options.prefetch //Do not give more than one message to a worker at a time
            },
            ([job]) => callback(job.data)
        );

        console.log("consume from queue ", result);
    }
}