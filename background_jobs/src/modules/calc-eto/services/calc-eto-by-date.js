import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { ServiceProtocol } from "../../funceme/core/service-protocol.js";
import { CalcEto } from "../domain/calc-eto.js";

export class CalcETOByDate extends ServiceProtocol {
  #equipmentRepository;
  #stationReadsRepository;
  #etoRepository;

  constructor(equipmentRepository, etoRepository, stationReadsRepository) {
    super();
    this.#equipmentRepository = equipmentRepository;
    this.#stationReadsRepository = stationReadsRepository;
    this.#etoRepository = etoRepository;
  }

  /**
   * @param {CalcEtoDTO} date Instance of CalcEtoDTO class
   */
  async execute(date) {
    const year = date.getDateToQuery().getYear();
    const day = date.getDateToQuery().getDay();

    Logger.info({
      msg: `Calculando dados de ETO pela data ${date
        .getDateToQuery()
        .getDate()}`,
    });

    const stationsEqps = await this.#equipmentRepository.getEquipments({
      eqpType: "station",
    });

    const stationsEto = [];

    if (stationsEqps.length === 0) {
      Logger.warn({
        msg: "Não há equipamentos de estação cadastrados.",
      });

      this.logs.addErrorLog({
        message: "Não há equipamentos de estação cadastrados.",
      });

      return Left.create(
        new Error(`Não há equipamentos de estação cadastrados.`)
      );
    }

    for (const station of stationsEqps) {
      // buscar leituras da estação usando o Fk_Equipment
      const stationReads = await this.#stationReadsRepository.getStationReads({
        idEqp: station.id,
        date: date.getDateToQuery(),
      });

      // e se não tiver dados de leituras da estação?
      if (stationReads === null || stationReads.length === 0) {
        Logger.warn({
          msg: " Estação está sem dados de medições.",
        });

        this.logs.addWarningLog({
          message: `Não há dados de medições da estação ${station.code} de ${
            station.location
          } na data de ${date.getDateToQuery()}`,
          raw: {
            equipment: station.id,
          },
        });

        continue;
      }

      const altitude = station.altitude;

      for (const stationRead of stationReads) {
        const {
          idRead,
          averageAtmosphericTemperature,
          minAtmosphericTemperature,
          maxAtmosphericTemperature,
          averageRelativeHumidity,
          maxRelativeHumidity,
          minRelativeHumidity,
          atmosphericPressure,
          totalRadiation,
          windVelocity,
        } = stationRead;

        if (averageAtmosphericTemperature === null) {
          this.logs.addWarningLog({
            message: `Não irá computar os dados de ET0 pois não há dados de temperatura atmosférica média da estação ${station.code} de ${station.location}`,
            raw: { equipment: station.id },
          });

          continue;
        }

        if (
          minAtmosphericTemperature === null ||
          maxAtmosphericTemperature === null
        ) {
          this.logs.addWarningLog({
            message: `Não há dados de temperatura máxima ou mínima da estação ${station.code} de ${station.location}, portanto os valores irão serem estimados.`,
            raw: { equipment: station.id },
          });
        }

        if (totalRadiation === null) {
          this.logs.addWarningLog({
            message: `Não há dados de radiação solar média da estação ${station.code} de ${station.location}, portanto irá ser estimado o valor da radiação solar.`,
            raw: { equipment: station.id },
          });
        }

        if (atmosphericPressure === null) {
          this.logs.addWarningLog({
            message: `Não há dados de pressão atmosférica da estação ${station.code} de ${station.location}, portanto o valor irá ser estimado.`,
            raw: { equipment: station.id },
          });
        }

        if (windVelocity === null) {
          this.logs.addWarningLog({
            message: `Não há dados da velocidade média do vento da estação ${station.code} de ${station.location}, portanto irá ser adotado o valor de referência de 2 m/s.`,
            raw: { equipment: station.id },
          });
        }

        if (averageRelativeHumidity === null) {
          this.logs.addWarningLog({
            message: `Não há dados de umidade relativa média da estação ${station.code} de ${station.location}, portanto irá ser estimado o valor da umidade média.`,
            raw: { equipment: station.id },
          });
        }

        const eto = CalcEto({
          date: {
            year,
            day,
          },
          measures: {
            altitude,
            sunQuantityHoursInDay: 11,
            averageAtmosphericTemperature,
            minAtmosphericTemperature,
            maxAtmosphericTemperature,
            averageRelativeHumidity,
            maxRelativeHumidity,
            minRelativeHumidity,
            atmosphericPressure,
            totalRadiation,
            windVelocity,
          },
        });

        if ((eto === null) | (eto === undefined)) {
          this.logs.addErrorLog({
            message: `Não foi possível calcular ET0 da estação ${station.code} de ${station.location} pois não há dados de temperatura média.`,
            raw: { equipment: station.id },
          });

          continue;
        }

        this.logs.addInfoLog({
          message: `Sucesso ao calcular dados de ET0 da estação ${station.code} de ${station.location}`,
          raw: { equipment: station.id },
        });

        stationsEto.push({
          idRead,
          eto,
        });
      }
    }

    if (stationsEto.length === 0) {
      this.logs.addWarningLog({
        message: `Não foi possível calcular ET0 da data ${date.getDateToQuery()}.`,
      });
      return Left.create(
        new Error(
          `Não foi possível calcular ET0 da data ${date.getDateToQuery()}.`
        )
      );
    }

    if (stationsEto.length) {
      Logger.info({
        msg: "Salvando dados de ETO...",
      });

      // await this.#etoRepository.deleteByTime(date.getDate());

      await this.#stationReadsRepository.updateEto(stationsEto);

      // this.logs.addInfoLog(`Sucesso ao calcular dados de ET0 do dia.`);
      return Right.create();
    }
  }
}
