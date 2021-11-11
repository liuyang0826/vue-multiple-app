import {IGeneratorConfig, ITemplate} from "./@types";
import fs from "fs";
import path from "path";

const templateMap = new Map<string, ITemplate>()

export function getTemplates() {
    return Array.from(templateMap.values())
}

export function getTemplateById(templateId: string) {
    return templateMap.get(templateId)
}

interface IContext {
    root: string
}

const context: IContext = {
    root: path.join(process.cwd(), "src")
}

export function getContext() {
    return context
}

function configScanner() {
    const configFile = path.join(process.cwd(), "generator.config.js")
    if (!fs.existsSync(configFile)) {
        return
    }
    const generatorConfig: IGeneratorConfig = require(configFile)
    const root = generatorConfig.root
    if (root) {
        context.root = root
    }
}

export function scanner() {
    fs.readdirSync(path.join(__dirname, "templates")).forEach((templateId) => {
        if (!templateId.startsWith(".")) {
            const template: ITemplate = require(`./templates/${templateId}`)
            templateMap.set(template.templateId, template)
        }
    })
    configScanner()
}