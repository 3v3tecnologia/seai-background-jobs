import { Validator } from "../../../../shared/validator.js";

export class SendUserAccountNotificationCommand {
  #email;
  #code;
  #template;
  constructor(props) {
    const hasNullOrUndefinedProps = Validator.againstNullOrUndefined({
      name: "data",
      value: props,
    });

    if (hasNullOrUndefinedProps.isError()) {
      throw hasNullOrUndefinedProps.error();
    }

    const isValidPayloadOrError = Validator.againstNullOrUndefinedProperties(
      ["email", "base64Code", "templateName"],
      props
    );

    if (isValidPayloadOrError.isError()) {
      throw isValidPayloadOrError.error();
    }

    this.#email = props.email;
    this.#code = props.base64Code;
    this.#template = props.templateName;

    Object.freeze(this);
  }

  getEmail() {
    return this.#email;
  }

  getCode() {
    return this.#code;
  }

  getTemplateName() {
    return this.#template;
  }
}
