import { MAILER_OPTIONS } from "../../config/mailer.js";
import { SUPPORT_CONTACT } from "../../config/support_contact.js";
import { EmailSender } from '../../infra/email-sender.js'

export class AccountCreation extends EmailSender {
    constructor(sendMailService, templateCompiler) {
        super(sendMailService, templateCompiler);
        this.templateName = 'register_users';
    }

    async execute({ email, redirect_url }) {
        await this.sendEmail({
            to: email,
            from: MAILER_OPTIONS.from,
            subject: "SEAI - Criação de conta",
            templateName: this.templateName,
            templateData: {
                redirect_url,
                contact: SUPPORT_CONTACT,
            }
        });
    }
}