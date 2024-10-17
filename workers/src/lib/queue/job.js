export class BackgroundJob {
    queueProvider;
    type;
    options;
    exchange

    constructor(queueProvider, type, options, exchange) {
        this.queueProvider = queueProvider;
        this.type = type;
        this.options = options;
        this.exchange = exchange;
    }

    async start() {
        await this.queueProvider.consumeFromQueue(this.type, this.work, this.options, this.exchange);
    }

    work(job) {
        throw new Error("Not implemented");
    };
}