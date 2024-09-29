export class BackgroundJob {
    queueProvider;
    type;

    constructor(queueProvider) {
        this.queueProvider = queueProvider;
    }

    async start() {
        await this.queueProvider.consumeFromQueue(this.type, this.work);
    }

    work(job) {
        throw new Error("Not implemented");
    };
}