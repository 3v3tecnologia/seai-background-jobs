import { sendUserAccountNotification } from "../../modules/mailer/handler/factories/send-user-account-notification.js";
import { Validator } from "../../shared/validator.js";

export async function SendUserAccountEmailNotification(command) {
    try {
        const isValidPayloadOrError = Validator.againstNullOrUndefinedProperties(
            ["email", "action", "redirect_url"],
            command
        );

        if (isValidPayloadOrError.isError()) {
            throw isValidPayloadOrError.error();
        }

        const { email, action, redirect_url } = msg

        await sendUserAccountNotification.execute({
            email, action, redirect_url
        });

        process.exit(0)
    } catch (error) {
        Logger.error({
            msg: "Falha ao enviar notificação para usuário",
            obj: error,
        });

        process.exit(1)
    }
}