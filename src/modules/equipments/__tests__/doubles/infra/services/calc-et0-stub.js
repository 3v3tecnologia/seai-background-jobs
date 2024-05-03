import { Right } from "../../../../../../shared/result.js";

export class CalcEt0ByEquipmentsMeasurementsStub {
  async execute(ids = []) {
    console.log("[CalcET0] :: calculating Et0 measurements by equipments");
    console.log("Ids :: ", ids);
    return Right.create(true);
  }
}
