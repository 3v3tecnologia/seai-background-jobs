export const NEWSLETTER_UNSUBSCRIBE_SITE =
    process.env.NEWSLETTER_UNSUBSCRIBE_SITE ||
    "http://localhost:8080/static/#/newsletter/unsubscribe";


const GOV_WEBPAGE =
    process.env.SEAI_SITE || "http://localhost:8080/static/#/login";


export const IRRIGANT_WEBPAGE = process.env.SEAI_IRRIGANT_SITE || "http://localhost:8080/static/#/login";

export const ACCOUNT_REDIRECT_LINK = {
    government: {
        create_account: `${GOV_WEBPAGE}/initial-register-infos`,
        recovery_account: `${GOV_WEBPAGE}/change-password`
    },
    irrigant: {
        create_account: `${IRRIGANT_WEBPAGE}/initial-register-infos`,
        recovery_account: `${IRRIGANT_WEBPAGE}/change-password`
    }
}

