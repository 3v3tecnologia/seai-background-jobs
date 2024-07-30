import amqp from "amqplib";
import { RABBIT_MQ_URI } from "../../config/message-queue.js";

export class RabbitMqServer {
  #connection;
  #channel;
  #uri;

  static instance;

  static create(url = RABBIT_MQ_URI) {
    if (!RabbitMqServer.instance) {
      RabbitMqServer.instance = new RabbitMqServer(url);
    }
    return RabbitMqServer.instance;
  }

  constructor(uri) {
    this.#uri = uri;
  }

  async start() {
    console.log("[🚀] Starting connection to RabbitMQ");
    this.#connection = await amqp.connect(this.#uri);
    this.#channel = await this.#connection.createChannel();
    console.log("[🎉] Connected successfully");
  }

  async close() {
    await this.#channel.close();
    await this.#connection.close();
  }

  // This tells RabbitMQ not to give more than x message to a worker at a time
  setConsumeRate(qtd) {
    this.#channel.prefetch(qtd);
  }

  //declare a queue
  async createOrConnectToQueue(
    queue,
    options = {
      durable: true, // make sure that the queue will survive a RabbitMQ node restart
    }
  ) {
    //Declaring a queue is idempotent
    await this.#channel.assertQueue(queue, options);
  }

  async createOrConnectToExchange(
    name,
    type,
    options = {
      durable: true,
    }
  ) {
    await this.#channel.assertExchange(name, type, options);
  }

  async bindQueueToExchange(queue, exchange, key = "") {
    await this.#channel.bindQueue(queue, exchange, key);
  }

  addToQueue(
    queue,
    message,
    options = {
      persistent: true, // it tells RabbitMQ to save the message to disk
    }
  ) {
    // return true if has sended
    return this.#channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      options
    );
  }

  sendToExchange(exchange, routingKey = "", message) {
    return this.#channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message))
    );
  }

  ack(message) {
    this.#channel.ack(message);
    console.log("[✅] Message processed successfully");
  }

  async consume(queue, callback) {
    console.log("Starting consumer to queue '%s'...", queue);
    await this.#channel.consume(queue, callback, {
      noAck: false, // manual acknowledgment mode
    });
    console.log("[⚙️] Waiting for messages to queue '%s'", queue);
  }
}
