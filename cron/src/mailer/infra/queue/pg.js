import { jobsDatabaseCredentials } from "./pg-boss.js";
import { QueueProviderProtocol } from "./provider.js";
import pgBoss from "pg-boss";

export class PgQueue extends QueueProviderProtocol {
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
        await this.#boss.start();
    }

    async send(queue, message, options = { retryLimit: 3, retryDelay: 1000 }) {
        await this.connect()

        await this.#boss.send(queue, message, options);
    }
}