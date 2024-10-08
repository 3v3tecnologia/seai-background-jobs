import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Logger } from "../../../shared/logger.js";
import { AVAILABLE_HTML_TEMPLATES_PATHS } from "../config/availables-templates.js";
import { FileNotFoundError } from "../errors/FileNotFound.js";

const getTemplate = async (action) => {
  const templateInfo = AVAILABLE_HTML_TEMPLATES_PATHS.get(action);

  if (!templateInfo) {
    Logger.error(
      `Não foi possível identificar template para o serviço solicitado.`
    );

    throw new FileNotFoundError(action);
  }

  Logger.info(`Lendo arquivo  de ${templateInfo.path}...`);

  return await fs.readFile(
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "..",
      templateInfo.path
    ),
    {
      encoding: "utf-8",
    }
  );
};

export default {
  getTemplate,
};
