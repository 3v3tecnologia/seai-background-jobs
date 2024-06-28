export class QueueServices {
  async sendToQueue(queue, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("sended");
      }, 2000);
    });
  }
}
