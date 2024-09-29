export class AccountNotificationInput {
  #email;
  #redirect_url;

  constructor(props) {
    this.#email = props.email;
    this.#redirect_url = props.redirect_url;

    Object.freeze(this);
  }

  get email() {
    return this.#email;
  }

  get redirect_url() {
    return this.#redirect_url;
  }

}
