import { Validator } from "../../../../shared/validator.js";

export class SendUserAccountNotificationCommand {
  #email;
  #action;
  #redirect_url;
  constructor(props) {
    const hasNullOrUndefinedProps = Validator.againstNullOrUndefined({
      name: "data",
      value: props,
    });

    if (hasNullOrUndefinedProps.isError()) {
      throw hasNullOrUndefinedProps.error();
    }

    const isValidPayloadOrError = Validator.againstNullOrUndefinedProperties(
      ["email", "action", "redirect_url"],
      props
    );

    if (isValidPayloadOrError.isError()) {
      throw isValidPayloadOrError.error();
    }

    this.#email = props.email;
    this.#action = props.action;
    this.#redirect_url = props.redirect_url;

    Object.freeze(this);
  }

  get email() {
    return this.#email;
  }

  get action() {
    return this.#action;
  }
  get redirect_url() {
    return this.#redirect_url;
  }
}
