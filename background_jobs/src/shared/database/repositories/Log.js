import { connections } from "../connection.js";

export class LogRepository {
  #connection;

  constructor() {
    this.#connection = connections.logs;
  }
  async create({ logs, tableName, operation }) {
    const data = logs.map((log) => {
      return {
        Operation: operation,
        Message: log.message,
        Status: log.type,
      };
    });

    await this.#connection.insert(data).into(tableName);
  }
}
