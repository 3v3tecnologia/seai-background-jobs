export class IrrigationRecommendationsServiceFaker {
  #data = [];

  constructor(data) {
    this.#data = data;
  }

  async getIrrigationsPerUserDataStream(signal) {
    const data = this.#data;

    const readable = new ReadableStream({
      start(controller) {
        if (data) {
          for (const user of data) {
            controller.enqueue(Buffer.from(JSON.stringify(user)));
          }
        }
        controller.close();
      },
    });

    return readable.getReader();
  }

  setData(data) {
    this.#data.push(data);
  }
}
