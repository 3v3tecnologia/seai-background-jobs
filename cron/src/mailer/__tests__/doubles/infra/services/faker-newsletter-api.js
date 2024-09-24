export class NewsletterServicesFaker {
  #newsList = [];
  #subscribers = null;

  constructor(news, subscribers) {
    this.#newsList = news;
    this.#subscribers = subscribers || [];
  }

  async getNewsById(id) {
    const data = this.#newsList.find((news) => {
      return (news.Id = id);
    });

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

    return data ? data : null;
  }

  async getAllRecipientsEmails() {
    return this.#subscribers;
  }

  async updateNewsletterSendAt({ id, date }) {
    const newsletter = this.#newsList.find((news) => news.Id === id);

    if (newsletter) {
      newsletter.SendAt = date;
    }
  }
}
