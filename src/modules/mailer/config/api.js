export const USER_API_BASE_URL =
  `${process.env.USER_API_ADDR}` || "http://localhost:80";

// export const USERS_SERVICES_API_URL = {
//   FORGOT_PASSWORD: USER_API_BASE_URL + "/password/reset",
//   CREATE_USER: USER_API_BASE_URL + "/initial-register-infos",
// };

export const NEWSLETTER_API_BASE_URL = `${process.env.NEWSLETTER_API_ADDR}/api/v1/news`;

export const IRRIGATION_API_BASE_URL =
  process.env.IRRIGATION_API_ADDR ||
  "http://localhost:8080/api/v2/management/irrigation_crops";

export const SEAI_MAIN_PAGE_URL = "http://seai.3v3.farm/static/#/login";
