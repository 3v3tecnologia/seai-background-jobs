
export const AVAILABLE_HTML_TEMPLATES_PATHS = (function () {
  const dir = "./resources/mail/templates";
  return new Map([
    [
      "newsletter-subscription",
      {
        path: `${dir}/newsletter-subscription.html`,
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
        path: `${dir}/daily-newsletter.html`,
      },
    ],
  ]);
})();
