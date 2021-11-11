import {ITemplate} from "./@types";
import fs from "fs";
import path from "path";

const templateMap = new Map<string, ITemplate>()

export function getTemplates() {
    return Array.from(templateMap.values())
}

export function getTemplateById(templateId: string) {
    return templateMap.get(templateId)
}

export function scanner() {
    fs.readdirSync(path.join(__dirname, "./templates")).forEach((templateId) => {
        if (!templateId.startsWith(".")) {
            const template: ITemplate = require(`./templates/${templateId}`)
            templateMap.set(template.templateId, template)
        }
    })
}