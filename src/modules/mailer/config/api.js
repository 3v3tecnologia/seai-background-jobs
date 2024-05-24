const USER_ACCOUNT_API_BASE_URL =
  process.env.USER_API_SERVER_BASE_URL || "http://localhost:8080/account";

export const SERVICES_API_URL = {
  USER_ACCOUNT: {
    FORGOT_PASSWORD: USER_ACCOUNT_API_BASE_URL + "/password/reset",
    CREATE_USER: USER_ACCOUNT_API_BASE_URL + "/complete-register",
  },
};
