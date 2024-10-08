export class AccountNotificationInput {
  #email;
  #user_code;
  #user_type;
  #action;

  constructor(props) {
    this.#email = props.email;
    this.#user_code = props.user_code;
    this.#user_type = props.user_type;
    this.#action = props.action;

    Object.freeze(this);
  }

  get email() {
    return this.#email;
  }

  get user_code() {
    return this.#user_code;
  }

  get user_type() {
    return this.#user_type;
  }
  get action() {
    return this.#action;
  }

}
