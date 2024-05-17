import { SEAI_API } from "./api.js";

export const HTML_TEMPLATES = (function () {
  const dir = "./resources/mail/templates";
  return new Map([
    [
      "createUserAccount",
      {
        path: `${dir}/create_user_account.html`,
        subject: "Bem vindo ao SEAI!",
        service_url: SEAI_API.ACCOUNT.CREATE_USER
      },
    ],
    [
      "forgotUserPassword",
      {
        path: `${dir}/forgot_password.html`,
        subject: "Recuperação de senha",
        service_url: SEAI_API.ACCOUNT.FORGOT_PASSWORD
      },
    ],
  ]);
})();
