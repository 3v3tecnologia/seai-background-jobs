export class HtmlTemplateEngineAdapterFaker {
    async compile({ file, args }) {
        return Promise.resolve("")
    }
}