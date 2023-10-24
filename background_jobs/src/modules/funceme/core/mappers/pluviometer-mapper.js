import { Logger } from "../../../../lib/logger/logger.js";

export class PluviometerMapper {
  static toDomain(pluviometerEqp) {
    const [date, pluviometer] = Object.values(pluviometerEqp.measures);

    return {
      code: pluviometerEqp.code,
      name: pluviometerEqp.name,
      date,
      pluviometer: parseFloat(pluviometer) || null,
    };
  }

  static toPersistency(pluviometer, measure, date = null) {
    const data = {
      Value: null,
      FK_Organ: pluviometer.id_organ,
      FK_Equipment: pluviometer.id,
    };

    if (date)
      Object.assign(data, {
        Time: date,
      });

    if (!measure) {
      Logger.warn({
        msg: `Não foi possível obter dados de medição do pluviômetro ${pluviometer.code}, salvando dados sem medições`,
      });

      return data;
    }

    // const { pluviometer } = measure;

    return Object.assign(data, {
      Value: measure.pluviometer,
    });
  }
}
