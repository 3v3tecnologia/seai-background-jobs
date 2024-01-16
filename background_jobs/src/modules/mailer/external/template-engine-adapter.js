import handlebars from "handlebars";

export class HtmlTemplateEngineAdapter {
  async compile({ file, args }) {
    const template = handlebars.compile(file);
    let htmlToSend = template(args);
    return htmlToSend;
  }
}
