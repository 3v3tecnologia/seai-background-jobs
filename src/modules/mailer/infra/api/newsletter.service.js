import { Logger } from "../../../../shared/logger.js";
import { Right, Left } from "../../../../shared/result.js";
import { NEWSLETTER_API_BASE_URL } from "../../config/api.js";
import { SEAI_API_KEY } from "../../../../shared/api-key.js";

export class NewsletterApi {
  /**
   * @description 
   * Date in YYYY-MM-DD format
   * @param {string} date 
   * @returns {{Title:string,Description:string, Link:string}[]}
   */
  async getNewsBySendDate(date) {
    try {
      const { data } = await (
        await fetch(`${NEWSLETTER_API_BASE_URL}/previews/${date}`, {
          headers: {
            "Access-Key": SEAI_API_KEY,
          },
        })
      ).json();

      return data;

    } catch (error) {
      Logger.error({
        msg: "Falha ao carregar notícia",
        obj: error,
      });
      return null;
    }
  }


  async getAllRecipientsEmails() {
    try {
      const { data } = await (
        await fetch(`${NEWSLETTER_API_BASE_URL}/subscribers/email`, {
          headers: {
            "Access-Key": SEAI_API_KEY,
          },
        })
      ).json();

      if (data) {
        return data;
      }

      return [];
    } catch (error) {
      Logger.error({
        msg: "Falha ao buscar destinatários da notícia",
        obj: error,
      });
      throw error
      // return Left.create(new Error(error));
    }
  }
  /**
   * @description Date in YYYY-MM-DD format
   * @param {string} date 
   * @returns Error or String
   */
  async updateNewsletterSendAt(date) {
    try {
      const response = await fetch(`${NEWSLETTER_API_BASE_URL}/send-date/${date}`, {
        method: "PATCH",
        headers: {
          "Access-Key": SEAI_API_KEY,
        }
      });

      if (response.status >= 400 && response.status <= 500) {
        Logger.error({
          msg: "Falha ao tentar atualizar data de envio da notícia",
        });

        return Left.create(new Error(response.error));
      }

      const result = await response.json();

      return Right.create(result.data);

    } catch (error) {
      Logger.error({
        msg: "Falha ao atualizar data de envio das notícias",
        obj: error,
      });

      return Left.create(new Error(error));
    }
  }
}
