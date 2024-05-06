export class MeasurementsMapper {
  static ToPersistency(list, alreadyRecordedEquipments) {
    const toPersistency = [];

    list.forEach((item) => {
      // Fetch already recorded equipment
      const equipment = alreadyRecordedEquipments.get(item.Code);

      if (equipment) {
        const measurements = item.Measurements;
        const { Id_Organ, Altitude, Location } = item;

        const { Id } = equipment;

        Object.assign(measurements, {
          FK_Equipment: Id,
          FK_Organ: Id_Organ,
          Altitude: Altitude || null,
          Longitude: Location?.Longitude || null,
          Latitude: Location?.Latitude || null,
        });

        toPersistency.push(measurements);
      }
    });

    return toPersistency;
  }
}
