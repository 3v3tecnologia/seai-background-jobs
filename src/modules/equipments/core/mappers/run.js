export function mapItemsToPersistency(mapper) {
  return (items, toJoin) => {
    return items.map((item) => {
      if (toJoin) {
        Object.assign(item, toConcat);
      }

      return mapper.toPersistency(item);
    });
  };
}
