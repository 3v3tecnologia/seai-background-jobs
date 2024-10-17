import amqp from "amqplib";
import { QueueProviderProtocol } from "../provider.js";

export class RabbitMqAdapter extends QueueProviderProtocol {
    constructor(url) {
        super()
        this.url = url;
        // this.exchange = exchange;
        // this.routingKey = routingKey;
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            console.log("[🚀] Starting connection to RabbitMQ");
            this.connection = await amqp.connect(this.url);
            this.channel = await this.connection.createChannel();
            console.log("[🎉] Connected successfully");
        } catch (err) {
            console.error('Error connecting to RabbitMQ:', err);
            throw err;
        }
    }

    async send(exchange, routingKey = "", message) {
        if (!this.channel) {
            await this.connect();
        }

        console.log(exchange, routingKey, Buffer.from(JSON.stringify(message)))

        return this.channel.publish(
            exchange,
            routingKey,
            Buffer.from(JSON.stringify(message))
        );
    }

    async disconnect() {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
        console.log('Disconnected from RabbitMQ');
    }

}
