import { SEAI_API_KEY } from "../../../../shared/api-key.js";
import { IRRIGATION_API_BASE_URL } from "../../config/api.js";

class IrrigationRecommendationsService {
  async getIrrigationsPerUserDataStream(signal) {
    const response = await fetch(`${IRRIGATION_API_BASE_URL}/recommendations`, {
      method: "GET",
      headers: {
        "x-api-key": SEAI_API_KEY,
      },
      signal,
    });

    return response.body.getReader();
  }
}

export const irrigationRecommendationsService =
  new IrrigationRecommendationsService();
