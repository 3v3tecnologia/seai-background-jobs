export class MetereologicalEquipmentRepositoryInMemory {
  #metereologicalEquipment;
  #stationsReads = [];
  #pluviometersReads = [];

  constructor(eqps = [], stationsReads = [], pluviometersReads = []) {
    this.#metereologicalEquipment = eqps.length ? eqps : [];
    this.#stationsReads = stationsReads;
    this.#pluviometersReads = pluviometersReads;
  }

  get stationsReads() {
    return this.#stationsReads;
  }

  get pluviometersReads() {
    return this.#pluviometersReads;
  }

  get equipments() {
    return this.#metereologicalEquipment;
  }

  async create(data = []) {
    const insertedEquipments = new Map();
    for (const item of data) {
      const id = new Date().getTime();
      item.IdEquipment = id;

      this.#metereologicalEquipment.push(item);
      insertedEquipments.set(item.IdEquipmentExternal, id);
    }

    return insertedEquipments;
  }

  async getTypes() {
    return new Map([
      ["station", 1],
      ["pluviometer", 2],
    ]);
  }

  async getOrganByName(organName) {
    return {
      Id_Organ: 1,
      Host: "FUNCEME",
      User: "TEST",
      Password: "123",
    };
  }

  async getEquipments({ eqpType = "" }) {
    const types = await this.getTypes();

    const idType = types.get(eqpType);

    let equipments = [];

    equipments = this.#metereologicalEquipment.filter(
      (eqp) => eqp.Type == idType
    );

    return equipments.map((station) => {
      return {
        Id: station.Id,
        Code: station.Code,
        Name: station.Name,
        Location: {
          Latitude: station.Latitude,
          Longitude: station.Longitude,
        },
        Altitude: station.Altitude,
        Type: station.Type,
        Organ: station.Organ,
        Id_Organ: station.Organ_Id,
      };
    });
  }

  async insertStationsMeasurements(measurements = []) {
    measurements.forEach((item) => (item.IdRead = Date.now()));
    this.#stationsReads = [...measurements, ...this.#stationsReads];
    return measurements.map((item) => item.IdRead);
  }

  async insertPluviometersMeasurements(measurements = []) {
    this.#pluviometersReads = [...measurements, ...this.#pluviometersReads];
  }

  async getStationCodesWithMeasurements(equipmentsCodes = [], time) {
    const codes = new Set();

    const eqps = this.#metereologicalEquipment.filter((eqp) =>
      equipmentsCodes.includes(eqp.Code)
    );
    // .map((eqp) => eqp.Code);

    this.#stationsReads.forEach((measurements) => {
      const eqp = eqps.find((eqp) => eqp.Id === measurements.FK_Equipment);
      if (measurements.Time === time && !!eqp) {
        codes.add(eqp.Code);
      }
    });

    return new Set(codes);
  }

  async getPluviometersCodesWithMeasurements(equipmentsCodes = [], time) {
    const codes = new Set();

    const eqps = this.#metereologicalEquipment.filter((eqp) =>
      equipmentsCodes.includes(eqp.Code)
    );
    // .map((eqp) => eqp.Code);

    this.#pluviometersReads.forEach((measurements) => {
      const eqp = eqps.find((eqp) => eqp.Id === measurements.FK_Equipment);
      if (measurements.Time === time && !!eqp) {
        codes.add(eqp.Code);
      }
    });

    return new Set(codes);
  }

  async updateStationsMeasurements(measurements = []) {
    return [];
  }
  async updatePluviometersMeasurements(measurements = []) {
    return true;
  }
}
