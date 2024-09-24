import { NullOrUndefinedError } from "./errors/NullOrUndefined.js";
import { Right, Left } from "./result.js";

export class Validator {
  static againstNullOrUndefinedBulk(list) {
    for (const argument of list) {
      againstNullOrUndefined(argument);
    }
  }
  static againstNullOrUndefinedProperties(properties, obj) {
    for (const property of properties) {
      if (
        Reflect.has(obj, property) === false ||
        checkIfIsNullOrUndefined(obj[property])
      ) {
        return Left.create(new NullOrUndefinedError(property));
      }
    }

    return Right.create(true);
  }

  static againstNullOrUndefined(arg) {
    if (checkIfIsNullOrUndefined(arg.value)) {
      return Left.create(new NullOrUndefinedError(arg.name));
    }

    return Right.create(true);
  }

  static againstEmptyArray(arg, message) {
    if (arg.length === 0 || arg === null || arg == undefined) {
      return Left.create(new Error(message));
    }

    return Right.create(true);
  }
}

function checkIfIsNullOrUndefined(value) {
  return value === null || value == undefined;
}
