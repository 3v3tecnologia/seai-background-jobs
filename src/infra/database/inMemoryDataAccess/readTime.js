export class ReadTimeInMemory {
  #Times = [];

  async create(date) {
    if (typeof date == "number") {
      const id = Math.round(Math.random() * 1000);
      this.#Times.push({
        IdTime: id,
        Time: date,
      });
      return id;
    }
    //Deve retornar o ID sempre que criar
    this.#Times.push(date);
    return this.#Times[this.#Times.length - 1].IdTime;
  }

  async list() {
    return this.#Times;
  }

  async getTimeByValue(timestamp) {}

  async getLastDate() {
    if (!this.#Times.length) {
      return null;
    }

    const date = this.#Times[this.#Times.length - 1];

    return {
      IdTime: date.IdTime,
      Time: date.Time,
    };
  }
}
