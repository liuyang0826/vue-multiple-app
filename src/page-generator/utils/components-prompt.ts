import inquirer from "inquirer";
import tipsSplit from "./tips-split";
import {IComponentConfig} from "../@types";
import {getTemplateById, getTemplates} from "../index";

async function componentsPrompt() {
    const components: IComponentConfig[] = []
    const { count } = await inquirer.prompt([
        {
            type: "number",
            message: "自定义组件个数:",
            name: "count",
            default: 0
        },
    ])

    for (let i = 0; i < count; i++) {
        tipsSplit({ split: `自定义组件${i + 1}` })
        const { templateId } = await inquirer.prompt([
            {
                type: "list",
                message: "组件模板",
                name: "templateId",
                choices: getTemplates().filter(d => !d.componentOnly).map(d => d.templateId)
            },
        ])
        components.push(
            await getTemplateById(templateId)!.configurator()
        )
    }
    return components
}

export default componentsPrompt