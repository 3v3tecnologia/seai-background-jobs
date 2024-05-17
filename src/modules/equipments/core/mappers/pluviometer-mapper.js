import { EquipmentMapper } from "./equipment.js";

export class PluviometerWithMeasurementsMapper {
  static toDomain(pluviometerEqp) {
    const [time, pluviometry] = Object.values(pluviometerEqp.Measurements);

    const toFloat = parseFloat(pluviometry);

    return {
      ...EquipmentMapper.toDomain(pluviometerEqp),
      Measurements: {
        Time: time,
        Pluviometry: toFloat >= 0 ? toFloat : null,
      },
    };
  }
}
