export const NEWSLETTER_API_BASE_URL = process.env.NEWSLETTER_API_ADDR || "http://localhost:8080/api/v1/news"

export const IRRIGATION_API_BASE_URL =
  process.env.IRRIGATION_API_ADDR ||
  "http://localhost:8080/api/v2/management/irrigation_crops";

export const NEWSLETTER_UNSUBSCRIBE_SITE =
  process.env.NEWSLETTER_UNSUBSCRIBE_SITE ||
  "http://localhost:8080/static/#/newsletter/unsubscribe";


export const GOV_WEBPAGE =
  process.env.SEAI_SITE || "http://localhost:8080/static/#/login";


export const IRRIGANT_WEBPAGE = process.env.SEAI_IRRIGANT_SITE || "http://localhost:8080/static/#/login";



