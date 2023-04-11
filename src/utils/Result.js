export class Result {
  #error = {};

  #value = null;

  isSuccess = false;
  isFailure = false;

  #time = null;

  constructor(isSuccess, error, value = null) {
    if (isSuccess && error) {
      throw new Error(
        "InvalidOperation: A result cannot be successful and contain an error"
      );
    }

    if (!isSuccess && !error) {
      throw new Error(
        "InvalidOperation: A failing result needs to contain an error message"
      );
    }

    this.#time = new Date();
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.#value = value;
    this.#error = error;

    Object.freeze(this);
  }

  get error() {
    return this.#error;
  }

  get time() {
    return this.#time;
  }

  get value() {
    return this.#value;
  }

  static success(value) {
    return new Result(true, null, value);
  }

  static error(error) {
    return new Result(false, error, null);
  }
}
