import writeFile from "./write-file";
import inquirer from "inquirer"
import fs from "fs"
import path from "path";
import {ITemplate} from "./@types";

const templateMap = new Map<string, ITemplate>()

export function getTemplates() {
    return Array.from(templateMap.values())
}

export function getTemplateById(templateId: string) {
    return templateMap.get(templateId)
}

function init() {
    fs.readdirSync(path.join(__dirname, "./templates")).forEach((templateId) => {
        if (!templateId.startsWith(".")) {
            const template: ITemplate = require(`./templates/${templateId}`)
            templateMap.set(template.templateId, template)
        }
    })

    console.log(templateMap);
}

async function main() {
    init()

    const { templateId } = await inquirer.prompt([
        {
            type: "list",
            message: `选择页面模板:`,
            name: "templateId",
            choices: getTemplates().filter(d => !d.componentOnly).map(d => d.templateId)
        }
    ])

    writeFile(await getTemplateById(templateId)!.configurator())
}

main()

