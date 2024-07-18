import { USER_API_BASE_URL } from "./api.js";

export const HTML_TEMPLATES = (function () {
  const dir = "./resources/mail/templates";
  return new Map([
    [
      "createUserAccount",
      {
        path: `${dir}/register_users.html`,
        subject: "SEAI - Verifique o seu email",
        service_url: USER_API_BASE_URL + "/account/initial-register-infos",
      },
    ],
    [
      "createIrrigantAccount",
      {
        path: `${dir}/register_users.html`,
        subject: "SEAI - Verifique o seu email",
        service_url: USER_API_BASE_URL + "/account/irrigant/activate",
      },
    ],
    [
      "forgotUserPassword",
      {
        path: `${dir}/redefined_password.html`,
        subject: "SEAI - Verifique o seu email",
        service_url: USER_API_BASE_URL + "/account/reset-password",
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
