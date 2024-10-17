export class QueueProviderProtocol {
    async send(exchange, routingKey = "", message) {
        throw new Error('Not implemented')
    }
}

