function parseMeasure(measure) {
  return parseFloat(measure) || null;
}

import { EquipmentMapper } from "./equipment.js";
export class StationWithMeasurementsMapper {
  static toDomain(station) {
    const [
      Time,
      AverageAtmosphericTemperature,
      MaxAtmosphericTemperature,
      MinAtmosphericTemperature,
      AverageRelativeHumidity,
      MaxRelativeHumidity,
      MinRelativeHumidity,
      AtmosphericPressure,
      WindVelocity,
      TotalRadiation,
    ] = Object.values(station.Measurements);

    return {
      ...EquipmentMapper.toDomain(station),
      Measurements: {
        Time,
        AverageAtmosphericTemperature: parseMeasure(
          AverageAtmosphericTemperature
        ),
        MaxAtmosphericTemperature: parseMeasure(MaxAtmosphericTemperature),
        MinAtmosphericTemperature: parseMeasure(MinAtmosphericTemperature),
        AverageRelativeHumidity: parseMeasure(AverageRelativeHumidity),
        MaxRelativeHumidity: parseMeasure(MaxRelativeHumidity),
        MinRelativeHumidity: parseMeasure(MinRelativeHumidity),
        AtmosphericPressure: parseMeasure(AtmosphericPressure),
        WindVelocity: parseMeasure(WindVelocity),
        TotalRadiation: parseMeasure(TotalRadiation),
      },
    };
  }
}
