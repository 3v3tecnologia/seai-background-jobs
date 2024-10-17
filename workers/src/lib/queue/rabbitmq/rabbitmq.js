import amqp from "amqplib";
import { QueueProviderProtocol } from "../queue-provider.js";

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

    async assertExchange(
        name,
        type,
        options = {
            durable: true,
        }
    ) {
        await this.channel.assertExchange(name, type, options);
    }

    async bindQueueToExchange(queue, exchange, key = "") {
        await this.channel.bindQueue(queue, exchange, key);
    }

    async assertQueue(queueName, options = {
        durable: true // queue won't be lost even if RabbitMQ restarts
    }) {

        await this.channel.assertQueue(queueName, options);
    }

    sendToExchange(exchange, routingKey = "", message) {
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

    async consumeFromQueue(queueName, callback, options = {
        prefetch: 1,
    }, exchange) {

        if (!this.channel) {
            await this.connect();
        }

        //Do not give more than one message to a worker at a time
        await this.channel.prefetch(options.prefetch)

        console.log(exchange);

        await this.assertExchange(exchange.name, exchange.type)

        await this.assertQueue(queueName, options)

        await this.bindQueueToExchange(queueName, exchange.name, exchange.routingKey)

        const result = await this.channel.consume(queueName, (msg) => {
            if (msg !== null) {
                console.log(JSON.parse(msg.content.toString()));
                callback(JSON.parse(msg.content.toString()));
                this.channel.ack(msg);
            }
        }, {
            noAck: false, // manual acknowledgment mode
        });

        console.log("consume from queue ", result);

    }
}
