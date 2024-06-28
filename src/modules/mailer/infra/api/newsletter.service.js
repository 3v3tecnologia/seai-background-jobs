import { Logger } from "../../../../shared/logger.js";
import { Right, Left } from "../../../../shared/result.js";
import { NEWSLETTER_API_BASE_URL } from "../../config/api.js";
import { SEAI_API_KEY } from "../../../../shared/api-key.js";

class NewsletterServices {
  async getNewsById(id) {
    try {
      const { data } = await (
        await fetch(`${NEWSLETTER_API_BASE_URL}/${id}`, {
          headers: {
            "x-api-key": SEAI_API_KEY,
          },
        })
      ).json();

      if (data) {
        return {
          Id: data.Id,
          Author: {
            Id: data.Fk_Sender,
            Email: data.Email,
            Organ: data.Organ,
          },
          Title: data.Title,
          Description: data.Description,
          Data: data.Data.data,
          CreatedAt: data.CreatedAt,
          UpdatedAt: data.UpdatedAt,
        };
      }

      return null;
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
            "x-api-key": SEAI_API_KEY,
          },
        })
      ).json();

      if (data) {
        return data;
      }

      return null;
    } catch (error) {
      Logger.error({
        msg: "Falha ao buscar destinatários da notícia",
        obj: error,
      });
      return Left.create(new Error(error));
    }
  }

  async updateNewsletterSendAt({ id, date }) {
    try {
      const response = await fetch(`${NEWSLETTER_API_BASE_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "x-api-key": SEAI_API_KEY,
        },
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
        msg: "Falha ao atualizar notícia",
        obj: error,
      });
      return Left.create(new Error(error));
    }
  }
}

export const newsletterServiceAPI = new NewsletterServices();
