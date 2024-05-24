import { Logger } from "../../../../shared/logger";
import { Right, Left } from "../../../../shared/result";

class NewsletterServicesApi {
  #baseUrl;

  constructor() {
    this.#baseUrl = SEAI_BASE_URL + "/api/v1/news";
  }

  async getNewsById(id) {
    try {
      const { data } = await (await fetch(`${this.#baseUrl}/${id}`)).json();

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
          Data: data.Content,
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

  async getRecipients() {
    const { data } = await (
      await fetch(`${this.#baseUrl}/subscribers/email`)
    ).json();

    if (data) {
      return data;
    }

    return null;
  }

  async updateSendAt({ id, date }) {
    try {
      const response = await fetch(`${this.#baseUrl}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SendAt: date,
        }),
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
      console.error(error);
      return Left.create(new Error(error));
    }
  }
}

export const newsletterServiceAPI = new NewsletterServicesApi();
