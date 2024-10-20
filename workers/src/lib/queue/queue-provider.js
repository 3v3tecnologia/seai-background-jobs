
export class QueueProviderProtocol {
    async connect() {
        throw new Error('Not implemented')
    }

    async disconnect() {
        throw new Error('Not implemented')
    }

    async assertQueue() {
        throw new Error('Not implemented')
    }

    async consumeFromQueue(queueName, callback, options) {
        throw new Error('Not implemented')
    }
}

export class QueueProvider extends QueueProviderProtocol {

    constructor(queueProvider) {
        super()
        this.queueProvider = queueProvider
    }

    async connect() {
        await this.queueProvider.connect()
    }

    async assertQueue(queueName, options = {}) {
        await this.queueProvider.assertQueue(queueName, options)
    }

    async disconnect() {
        await this.queueProvider.disconnect()
    }

    async consumeFromQueue(queueName, callback, options = {
        prefetch: 1,
    }) {
        await this.queueProvider.consumeFromQueue(queueName, callback, options)
    }
}