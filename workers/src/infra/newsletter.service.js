import { Left, Right } from '../helpers/result.js'
import { SEAI_API_KEY } from "../config/api-key.js";
import { NEWSLETTER_API_BASE_URL } from "../config/api.js";
import { Logger } from "../helpers/logger.js";

export class NewsletterApi {
  /**
   * @description Date in YYYY-MM-DD format
   * @param {string} date 
   * @returns {Promise<Left | Right>}
   */
  async markAsSent(date) {
    try {
      const response = await fetch(`${NEWSLETTER_API_BASE_URL}/${date}`, {
        method: "PATCH",
        headers: {
          "Access-Key": SEAI_API_KEY,
        }
      });

      if (response.status >= 400 && response.status <= 500) {
        Logger.error({
          msg: "Falha ao tentar atualizar data de envio das notícias",
        });

        return Left.create(new Error(response.error));
      }

      const result = await response.json();

      return Right.create(result.data);

    } catch (error) {
      Logger.error({
        msg: "Falha ao tentar atualizar data de envio das notícias",
        obj: error,
      });

      return Left.create(new Error(error));
    }
  }
}
