export class Filter {
  #predicate;
  #items;

  constructor({ items, predicate }) {
    this.#predicate = predicate;
    this.#items = items;
  }

  exec() {
    return this.#items.filter((item) => this.#predicate.compare(item));
  }
}
