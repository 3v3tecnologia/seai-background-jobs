import { USERS_SERVICES_API_URL } from "./api.js";

export const HTML_TEMPLATES = (function () {
  const dir = "./resources/mail/templates";
  return new Map([
    [
      "createUserAccount",
      {
        path: `${dir}/create_user_account.html`,
        subject: "SEAI - Verifique o seu email",
        service_url: USERS_SERVICES_API_URL.CREATE_USER,
      },
    ],
    [
      "forgotUserPassword",
      {
        path: `${dir}/forgot_password.html`,
        subject: "SEAI - Verifique o seu email",
        service_url: USERS_SERVICES_API_URL.FORGOT_PASSWORD,
      },
    ],
    [
      "user_irrigation_suggestion",
      {
        path: `${dir}/irrigation-suggestion.html`,
        subject: "SEAI - Recomendação de lâmina",
        service_url: USERS_SERVICES_API_URL.FORGOT_PASSWORD,
      },
    ],
  ]);
})();
