import { SERVICES_API_URL } from "./api.js";

export const HTML_TEMPLATES = (function () {
  const dir = "./resources/mail/templates";
  return new Map([
    [
      "createUserAccount",
      {
        path: `${dir}/create_user_account.html`,
        subject: "SEAI - Verifique o seu email",
        service_url: SERVICES_API_URL.USER_ACCOUNT.CREATE_USER,
      },
    ],
    [
      "forgotUserPassword",
      {
        path: `${dir}/forgot_password.html`,
        subject: "SEAI - Verifique o seu email",
        service_url: SERVICES_API_URL.USER_ACCOUNT.FORGOT_PASSWORD,
      },
    ],
  ]);
})();
