const USER_ACCOUNT_API_BASE_URL =
  `${process.env.USER_API_ADDR}/account` || "http://localhost:8080/account";

export const USERS_SERVICES_API_URL = {
  FORGOT_PASSWORD: USER_ACCOUNT_API_BASE_URL + "/password/reset",
  CREATE_USER: USER_ACCOUNT_API_BASE_URL + "/complete-register",
};

export const NEWSLETTER_API_BASE_URL = `${process.env.NEWSLETTER_API_ADDR}/api/v1/news`;

export const IRRIGATION_API_BASE_URL =
  process.env.IRRIGATION_API_ADDR ||
  "http://localhost:8080/api/v2/management/irrigation_crops";
