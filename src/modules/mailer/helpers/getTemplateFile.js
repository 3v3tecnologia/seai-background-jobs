import { HTML_TEMPLATES } from "../config/templates.js";
import { FileNotFoundError } from "../errors/FileNotFound.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";

const getTemplate = async (templateName) => {
  if (HTML_TEMPLATES.has(templateName) === false) {
    Logger.error(
      `Não foi possível identificar template para para o serviço solicitado`
    );
    return Left.create(new FileNotFoundError(templateName));
  }

  const templateInfo = HTML_TEMPLATES.get(templateName);

  Logger.info(`Lendo arquivo  de ${templateInfo.path}...`);

  const templateFile = await fs.readFile(
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "..",
      templateInfo.path
    ),
    {
      encoding: "utf-8",
    }
  );

  return Right.create({
    file: templateFile,
    info: templateInfo,
  });
};

export default {
  getTemplate,
};
