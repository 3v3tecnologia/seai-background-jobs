export function CalcExtraterrestrialRadiation(
  phi,
  solarDeclination,
  omega_s,
  julianDay
) {
  const distanceBetweenEarthAndSun =
    1 + 0.033 * Math.cos((2 * Math.PI * julianDay) / 365); // Correção distância sol-terra

  const SOLAR_CONSTANT = 4.92;

  const sinq =
    omega_s * Math.sin(phi) * Math.sin(solarDeclination) +
    Math.sin(omega_s) * Math.cos(phi) * Math.cos(solarDeclination);

  return (sinq * 24 * SOLAR_CONSTANT * distanceBetweenEarthAndSun) / Math.PI;
}

export function EstimateSolarRadiation(
  omega_s,
  extraterrestrialRadiation,
  sunQuantityHoursInDay = 11
) {
  // Máximo de horas de sol em um dia
  const sunMaxDailyHours = (24 / Math.PI) * omega_s; // ou N

  const As = 0.25;
  const Bs = 0.5;

  return (
    (As + Bs * (sunQuantityHoursInDay / sunMaxDailyHours)) *
    extraterrestrialRadiation
  );
}

export function AdjustSolarRadiation(totalRadiationAverage) {
  return totalRadiationAverage * 0.0036 * 24;
}

export function CalcClearSkyRadiation(altitude, extraterrestrialRadiation) {
  return (0.75 + altitude * 2 * 10 ** -5) * extraterrestrialRadiation;
}

export function CalcLiquidRadiation(
  solarRadiationTotal,
  maxTemperature,
  minTemperature,
  currentSteamPressureValue,
  nebulosityFactor
) {
  const CULTURE_REFLECTION = 0.23;
  const sigma = 4.901 * Math.pow(10, -9); // Constante de Steffan-Boltzman (Modificado)

  // Saldo líquido de radiação de ondas curtas
  const shortWaveRadiation = solarRadiationTotal * (1 - CULTURE_REFLECTION);

  const MaxTemperatureAbsolute = maxTemperature + 273.16;
  const MinTemperatureAbsolute = minTemperature + 273.16;

  /*
      Net outgoing long-wave radiation, [MJ m-2 h-1] (defined as being
      positive, upwards and negative downwards)
    */
  const longWaveRadiation =
    sigma *
    ((MaxTemperatureAbsolute ** 4 + MinTemperatureAbsolute ** 4) / 2) *
    (0.34 - 0.14 * Math.sqrt(currentSteamPressureValue)) *
    nebulosityFactor; // radiação de ondas longas

  const liquidRad = shortWaveRadiation - longWaveRadiation;
  return liquidRad;
}

export function CalcMaxAndMinTemperatureEstimation(
  solarRadiationTotal,
  extraterrestrialRadiation,
  temperatureAverage
) {
  //Para dados diários, é necessário estimar a temperatura máxima e mínima

  /*
      For 'interior' locations, defined as where the local land massa dominates 
      and air masses are not strongly influenced by a large water body, k = 0.16

      For 'coastal' locations, suited on or adjacent to teh cosast of a large
      land mass and where the air masses are influenced by a nearby water body
      k = 0.19
    */

  const k_rs = 0.19; // Coeficiente de ajuste empírico

  const thermal_diff =
    (solarRadiationTotal / (k_rs * extraterrestrialRadiation)) ** 2; //amplitude térmica

  // estimativas de temperaturas baseadas na temperatura média vindo da FUNCEME
  const maxTemperature = temperatureAverage + thermal_diff / 2;
  const minTemperature = temperatureAverage - thermal_diff / 2;

  return {
    maxTemperature,
    minTemperature,
  };
}

export function CalcSunsetHourAngle(phi, solarDeclination) {
  return Math.acos(-Math.tan(phi) * Math.tan(solarDeclination));
}

export function CalcNebulosityFactor(solarRadiationTotal, clearSkyRadiation) {
  /*
      The ratio Rs/Rso in Eq. 45 represents relative cloudiness and is limited to 0.3 < Rs/Rso
    ≤ 1.0 so that fcd has limits of 0.05 ≤ fcd ≤ 1.0. 
    */

  let div = solarRadiationTotal / clearSkyRadiation;

  if (div < 0.3) {
    div = 0.3;
  } else if (div > 1) {
    div = 1;
  }

  return 1.35 * div - 0.35;
}

export function CalcFlowHeatSoil() {
  /// Fluxo de calor do solo
  /*
      The magnitude of the daily, weekly or ten-day soil heat flux density, G, beneath a
      fully vegetated grass or alfalfa reference surface is relatively small in comparison
      with Rn. Therefore, it is ignored so that:
    */
  return 0;
}
export function CalcGAsterico(gama, windVelocity) {
  //Fator da planilha
  // 200/208 = 0.9615
  // 50/208 = 0.24
  // Caso diário -> 70.72/208 = 0.34
  const r_s = 70.72;

  //Assume que o vento no mínimo seria 0.5 m/s (Colocar como cadastro?)
  const r_a = windVelocity < 0.5 ? 208 / 0.5 : 208 / windVelocity;

  //Produto com gama no denominador
  return gama * (1 + r_s / r_a);
}

export function CalcSteamPressureEstimation(temperatureMin) {
  const saturationSteamPressure =
    0.611 * Math.exp((17.27 * temperatureMin) / (temperatureMin + 237.3));

  const currentSteamPressureValue = saturationSteamPressure;

  return {
    currentSteamPressureValue,
    saturationSteamPressure,
  };
}

export function CalcSteamPressure({
  minAtmosphericTemperature,
  maxAtmosphericTemperature,
  minRelativeHumidity,
  maxRelativeHumidity,
}) {
  const minSaturationSteamPressure =
    0.6108 *
    Math.exp(
      (17.27 * minAtmosphericTemperature) / (minAtmosphericTemperature + 237.3)
    );

  const maxSaturationSteamPressure =
    0.6108 *
    Math.exp(
      (17.27 * maxAtmosphericTemperature) / (maxAtmosphericTemperature + 237.3)
    );

  const saturationSteamPressure =
    (minSaturationSteamPressure + maxSaturationSteamPressure) / 2;

  const currentSteamPressureValue =
    ((minSaturationSteamPressure * maxRelativeHumidity) / 100 +
      (maxSaturationSteamPressure * minRelativeHumidity) / 100) /
    2;

  return {
    currentSteamPressureValue,
    saturationSteamPressure,
  };
}
// antigo etoPrecalc
export function CalcInclinationBetweenSteamPressureAndTemperature(
  averageAtmosphericTemperature
) {
  /*
    Cálculo do Delta (Inclinação da curva entre pressão de vapor de saturação e temperatura)
    pelo documento de referência, a diferença é muito pequena
  */
  return (
    (2503 *
      Math.exp(
        (17.27 * averageAtmosphericTemperature) /
          (averageAtmosphericTemperature + 237.3)
      )) /
    (averageAtmosphericTemperature + 237.3) ** 2
  );
}

export function CalcGama(atmosphericPressure) {
  // Gama pelo documento
  return 0.000665 * atmosphericPressure;
}

export function CalcAero(
  gama,
  delta,
  g_asterico,
  atmosphericTemperatureAverage,
  windVelocity,
  saturationSteamPressure,
  currentSteamPressureValue
) {
  return (
    (gama *
      (900 / (273 + atmosphericTemperatureAverage)) *
      windVelocity *
      (saturationSteamPressure - currentSteamPressureValue)) /
    (delta + g_asterico)
  );
}

export function CalcRadiation(delta, liquidRad, flowDensity, g_asterico) {
  return (0.408 * delta * (liquidRad - flowDensity)) / (delta + g_asterico);
}
