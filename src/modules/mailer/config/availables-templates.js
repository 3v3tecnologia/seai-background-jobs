export const AVAILABLE_HTML_TEMPLATES_PATHS = (function () {
  const dir = "./resources/mail/templates";
  return new Map([
    [
      "create-user-account",
      {
        path: `${dir}/register_users.html`,
      },
    ],
    [
      "newsletter-subscription",
      {
        path: `${dir}/newsletter-subscription.html`,
      },
    ],
    [
      "forgot-user-account",
      {
        path: `${dir}/redefined_password.html`,
      },
    ],
    [
      "user_irrigation_suggestion",
      {
        path: `${dir}/irrigation-suggestion.html`,
      },
    ],
    [
      "newsletter",
      {
        path: `${dir}/newsletter.html`,
      },
    ],
  ]);
})();
