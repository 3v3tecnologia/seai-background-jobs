
import path from "node:path";
import fs from "node:fs/promises";
import { MAILER_OPTIONS } from "../config/mailer.js";
import { Logger } from "../helpers/logger.js";
import { fileURLToPath } from "node:url";

export class EmailSender {
    sendMail;
    templateCompiler;
    emailTemplatesPath;

    constructor(sendMailService, templateCompiler) {
        this.sendMail = sendMailService;
        this.templateCompiler = templateCompiler;

        this.emailTemplatesPath = "./resources/mail/templates";
        // this.emailTemplatesPath = path.join(__dirname, 'emailTemplates');
    }

    async sendEmail({
        to,
        from,
        subject,
        templateName,
        templateData
    } = {
            to: '',
            from: MAILER_OPTIONS.from,
            subject: '',
            templateName: '',
            templateData: ''
        }) {
        const templatePath = this.emailTemplatesPath + `/${templateName}.html`;

        const template = await this.loadTemplate(templatePath);

        const html = await this.templateCompiler.compile({
            file: template,
            args: templateData,
        });

        console.log(`Sending email to ${to}...`);
        console.log(html);

        Logger.info({
            msg: `Sending email to ${to}:`
        });

        await this.sendMail.send({
            from,
            to,
            subject,
            html,
        })

        Logger.info({
            msg: `Email sent :)`
        })
    }

    async loadTemplate(templatePath) {
        return await fs.readFile(
            path.resolve(
                path.dirname(fileURLToPath(import.meta.url)),
                "..",
                "mailer",
                templatePath
            ),
            {
                encoding: "utf-8",
            }
        )
    }

    async execute(data) {
        throw new Error("Not implemented")
    }
}