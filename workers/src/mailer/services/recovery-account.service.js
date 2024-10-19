import { EmailSender } from '../../infra/email-sender.js'
import { SUPPORT_CONTACT } from "../../config/support_contact.js";

export class RecoveryAccount extends EmailSender {
    constructor(sendMailService, templateCompiler) {
        super(sendMailService, templateCompiler);
        this.templateName = 'redefined_password';
    }

    async execute({ email, redirect_url }) {
        await this.sendEmail({
            to: email,
            from: MAILER_OPTIONS.from,
            subject: "SEAI - Recuperação de conta",
            templateName: this.templateName,
            templateData: {
                redirect_url,
                contact: SUPPORT_CONTACT,
            }
        });
    }
}