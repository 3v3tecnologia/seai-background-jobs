import { sendNewsletterSubscriptionNotification } from "../../services/factories/newsleter-subscription.js";
import { NewsletterSubscriptionNotification } from "../newsletter-subscription.js";

export const newsletterSubscriptionNotification =
  new NewsletterSubscriptionNotification(
    sendNewsletterSubscriptionNotification
  );
