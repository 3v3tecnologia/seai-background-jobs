import { USER_API_BASE_URL } from "./api.js";

export const HTML_TEMPLATES = (function () {
  const dir = "./resources/mail/templates";
  return new Map([
    [
      "createUserAccount",
      {
        path: `${dir}/create_user_account.html`,
        subject: "SEAI - Verifique o seu email",
        service_url: USER_API_BASE_URL + "/initial-register-infos",
      },
    ],
    [
      "createIrrigantAccount",
      {
        path: `${dir}/create_user_account.html`,
        subject: "SEAI - Verifique o seu email",
        service_url: USER_API_BASE_URL + "/account/activate",
      },
    ],
    [
      "forgotUserPassword",
      {
        path: `${dir}/forgot_password.html`,
        subject: "SEAI - Verifique o seu email",
        service_url: USER_API_BASE_URL + "/forgot-password",
      },
    ],
    [
      "user_irrigation_suggestion",
      {
        path: `${dir}/irrigation-suggestion.html`,
        subject: "SEAI - Recomendação de lâmina",
      },
    ],
  ]);
})();
