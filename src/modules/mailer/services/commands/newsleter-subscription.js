export class NewsletterSubscriptionDTO {
  #email = null;
  #link = null;

  constructor(props) {
    this.#email = props.email;
    this.#link = props.confirmation_link;

    Object.freeze(this);
  }

  get email() {
    return this.#email;
  }

  get link() {
    return this.#link;
  }
}
