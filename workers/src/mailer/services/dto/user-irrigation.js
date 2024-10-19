export class IrrigationReportsNotificationInput {
  #email;
  #irrigation;

  constructor(props) {
    this.#email = props.email;
    this.#irrigation = props.irrigation;

    Object.freeze(this);
  }

  get email() {
    return this.#email;
  }

  get irrigation() {
    return this.#irrigation;
  }

}
