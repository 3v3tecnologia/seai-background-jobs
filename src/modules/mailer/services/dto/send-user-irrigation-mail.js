export class SendUserIrrigationMailInputDTO {
  #props = {
    Name: null,
    Email: null,
    Irrigation: null,
  };

  constructor(props) {
    this.#props = props;

    Object.freeze(this);
  }

  getName() {
    return this.#props.Name;
  }

  getEmail() {
    return this.#props.Email;
  }

  getIrrigation() {
    return this.#props.Irrigation;
  }

  getNotification() {
    return this.#props?.Notification || null;
  }
}
