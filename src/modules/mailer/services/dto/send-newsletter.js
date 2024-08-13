import { Validator } from "../../../../shared/validator.js";

export class SendNewsletterInputDTO {
  #props = {
    id: null,
    title: null,
    description: null,
    content: null,
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
      ["id", "title", "description", "content"],
      props
    );

    if (isValidPayloadOrError.isError()) {
      throw isValidPayloadOrError.error();
    }

    this.#props.id = props.id;
    this.#props.title = props.title;
    this.#props.description = props.description;
    this.#props.content = props.content;

    Object.freeze(this);
  }

  get id() {
    return this.#props.id;
  }

  get title() {
    return this.#props.title;
  }

  get description() {
    return this.#props.description;
  }

  get content() {
    return this.#props.content;
  }
}
