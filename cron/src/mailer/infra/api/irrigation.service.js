import { SEAI_API_KEY } from "../../../config/api-key.js";
import { IRRIGATION_API_BASE_URL } from "../../config/api.js";


export class IrrigationRecommendationsService {
  async getIrrigationsPerUserDataStream(signal) {
    const response = await fetch(`${IRRIGATION_API_BASE_URL}/recommendations`, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
        "Access-Key": SEAI_API_KEY,
      },
      signal,
    });

    return response.body.getReader();
  }
}
