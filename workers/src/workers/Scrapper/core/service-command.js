import { Notification } from "./logs-notification.js";

export class Command {
  logs;
  constructor() {
    this.logs = new Notification();
  }

  getLogs() {
    return this.logs.getLogs();
  }

  async execute(params) {
    throw new Error("Command method not implemented");
  }
}
