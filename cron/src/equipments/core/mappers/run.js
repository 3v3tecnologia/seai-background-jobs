export function mapItemsToPersistency(mapper) {
  return (items, toJoin) => {
    return items.map((item) => {
      if (toJoin) {
        Object.assign(item, toJoin);
      }

      return mapper.toPersistency(item);
    });
  };
}
