import { Validator } from "../../../../shared/validator.js";

export class SendNewsletterCommand {
  #props = {
    newsId: null,
  };
  constructor(props) {
    const hasNullOrUndefinedProps = Validator.againstNullOrUndefined({
      name: "data",
      value: props,
    });

    if (hasNullOrUndefinedProps.isError()) {
      throw hasNullOrUndefinedProps.error();
    }

    const isValidPayloadOrError = Validator.againstNullOrUndefinedProperties(
      ["id"],
      props
    );

    if (isValidPayloadOrError.isError()) {
      throw isValidPayloadOrError.error();
    }

    this.#props.newsId = props.id;

    Object.freeze(this);
  }

  get id() {
    return this.#props.newsId;
  }
}
