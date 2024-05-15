import { Validator } from "../../../../shared/validator.js";

export class InviteUserCommand {
  #props;
  constructor(props) {
    const hasNullOrUndefinedProps = Validator.againstNullOrUndefined({
      name: "data",
      value: props,
    });

    if (hasNullOrUndefinedProps.isError()) {
      throw hasNullOrUndefinedProps.error();
    }

    const isValidPayloadOrError = Validator.againstNullOrUndefinedProperties(
      ["email", "code", "template"],
      props
    );

    if (isValidPayloadOrError.isError()) {
      throw isValidPayloadOrError.error();
    }

    this.#props.email = props.email;
    this.#props.code = props.code;
    this.#props.template = props.template;

    Object.freeze(this);
  }

  getRecipient() {
    return {
      email: this.#props.email,
      code: this.#props.code,
    };
  }

  getTemplateName() {
    return this.#props.template;
  }
}
