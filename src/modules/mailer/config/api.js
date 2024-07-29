export const USER_API_BASE_URL =
  `${process.env.USER_API_ADDR}` || "http://localhost:8080";

export const NEWSLETTER_API_BASE_URL = `${process.env.NEWSLETTER_API_ADDR}/api/v1/news`;

export const IRRIGATION_API_BASE_URL =
  process.env.IRRIGATION_API_ADDR ||
  "http://localhost:8080/api/v2/management/irrigation_crops";

export const SEAI_MAIN_PAGE_URL =
  process.env.SEAI_MAIN_PAGE_URL || "http://localhost:8080/static/#/login";

export const NEWSLETTER_UNSUBSCRIBE_PAGE =
  process.env.NEWSLETTER_UNSUBSCRIBE_PAGE ||
  "http://localhost:8080/static/#/newsletter/unsubscribe";
