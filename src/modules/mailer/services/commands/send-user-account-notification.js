import { Validator } from "../../../../shared/validator.js";

export class SendUserAccountNotificationCommand {
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
      ["email", "base64Code", "templateName"],
      props
    );

    if (isValidPayloadOrError.isError()) {
      throw isValidPayloadOrError.error();
    }

    this.#props.email = props.email;
    this.#props.code = props.base64Code;
    this.#props.template = props.templateName;

    Object.freeze(this);
  }

  getEmail() {
    return this.#props.email
  }

  getCode() {
    return this.#props.code
  }

  getTemplateName() {
    return this.#props.template;
  }
}
