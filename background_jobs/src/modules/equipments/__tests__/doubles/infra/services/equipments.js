import { Left,Right } from "../../../../../../shared/result.js";

export class EquipmentsServicesStub{
    #metereologicalEquipment = [];
    #stationsReads = [];
    #pluviometersReads = [];

    getMeteorologicalOrganCredentials(organName){
        return Right.create({
            "Id": 2,
            "Host": "ftp.funceme.br",
            "User": "pcds.funceme",
            "Password": "kDnQgk1h"
        })
    }

    bulkInsert(data = []){
        this.#metereologicalEquipment = [...this.#metereologicalEquipment, ...data]
    }

    getCodesByTypes(types = ["station", "pluviometer"]) {
        return Right.create([
		{
			"Type": 1,
			"Name": "station"
		},
		{
			"Type": 2,
			"Name": "pluviometer"
		}
	])
    }

    getEquipmentsWithMeasurements(codes = [], date, type){}

    getTypes(){}

    bulkInsertMeasurements(type, measurements){}

    bulkUpdateMeasurements(type, measurements){}
}