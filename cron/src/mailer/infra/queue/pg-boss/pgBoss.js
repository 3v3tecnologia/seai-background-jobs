import knex from "knex";
import { QueueProviderProtocol } from "../provider.js";

export class PgBossMqAdapter extends QueueProviderProtocol {
    constructor(url) {
        super()

        this.url = url;

        this.connection = knex({
            client: "pg",
            connection: this.url,
            pool: {
                min: 2,
                max: 10,
            },
        });
    }

    async connect() {
        console.log('Connected to PgBoss');
    }

    async send(queue, message) {
        const defaultOptions = {
            retrylimit: 3,
            retrydelay: 60,
        };

        const data = {
            name: queue,
            data: message || null,
            ...defaultOptions,
        };


        await this.connection
            .insert(data)
            .returning("*")
            .into("pgboss.job");
    }

    async disconnect() {
        console.log('Disconnected from PgBoss');
    }

}
