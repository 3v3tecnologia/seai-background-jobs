import { SendEmailService } from "../../external/send-email.js";
import { HtmlTemplateEngineAdapter } from "../../external/template-engine-adapter.js";
import { InviteUserService } from "../invite-user.js";

const inviteUserService = new InviteUserService(
  new SendEmailService(),
  new HtmlTemplateEngineAdapter()
);

export { inviteUserService };
