export class BelongTo {
  constructor(toCompareList = new Map()) {
    this.toCompareList = toCompareList;
  }

  compare(item) {
    return this.toCompareList.has(item.Code);
  }
}
export class NotBelongTo {
  constructor(toCompareList = new Map()) {
    this.toCompareList = toCompareList;
  }

  compare(item) {
    return this.toCompareList.has(item.Code) === false;
  }
}
