import writeFile from "./write-file";
import inquirer from "inquirer"
import {getTemplateById, getTemplates, scanner} from "./scanner";

async function main() {
    scanner()
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

