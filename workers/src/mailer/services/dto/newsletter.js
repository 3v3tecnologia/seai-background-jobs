export class SendNewsletterInput {
  #email;
  #content;
  #user_code;
  #from;

  constructor(props) {
    this.#email = props.email;
    this.#content = props.content;
    this.#from = props.from;

    Object.freeze(this);
  }

  get email() {
    return this.#email;
  }

  get content() {
    return this.#content;
  }
  get user_code() {
    return this.#user_code;
  }
  get from() {
    return this.#from;
  }

}
