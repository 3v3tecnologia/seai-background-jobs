
export const AVAILABLE_HTML_TEMPLATES_PATHS = (function () {
  const dir = "./resources/mail/templates";
  return new Map([
    [
      "create_account",
      {
        path: `${dir}/register_users.html`,
      },
    ],
    [
      "recovery_account",
      {
        path: `${dir}/redefined_password.html`,
      },
    ]
  ]);
})();
