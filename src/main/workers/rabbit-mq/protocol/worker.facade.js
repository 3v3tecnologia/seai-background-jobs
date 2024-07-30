export class Worker {
  #queueServiceProvider;
  #config;

  constructor(
    queueServiceProvider,
    config = {
      queue: {
        name: "",
        bind_key: "",
      },
      exchange: {
        name: "",
        type: "",
      },
      consume_rate: 1,
    }
  ) {
    this.#queueServiceProvider = queueServiceProvider;
    this.#config = config;
  }

  async start() {
    try {
      // await this.#queueServiceProvider.start();

      //This makes sure the queue is declared before attempting to consume from it
      await this.#queueServiceProvider.createOrConnectToExchange(
        this.#config.exchange.name,
        this.#config.exchange.type
      );

      await this.#queueServiceProvider.createOrConnectToQueue(
        this.#config.queue.name
      );

      await this.#queueServiceProvider.bindQueueToExchange(
        this.#config.queue.name,
        this.#config.exchange.name,
        this.#config.queue.bind_key
      );

      // RabbitMQ will send 1 message at a time if the worker ack the previous message
      this.#queueServiceProvider.setConsumeRate(this.#config.consume_rate);

      await this.#queueServiceProvider.consume(
        this.#config.queue.name,
        async (message) => {
          const data = message.content.toString();

          console.log("[📨] Received '%s'", data);

          const successOrError = await this.handle(data);

          if (successOrError.isSuccess()) {
            this.#queueServiceProvider.ack(message);
          }
        }
      );
    } catch (error) {
      console.warn(error);
    }
  }

  async handle(message) {
    throw new Error("Abstract method not implemented");
  }

  async setupShutdown() {}
}
