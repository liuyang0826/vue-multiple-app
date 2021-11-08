import inquirer from "inquirer";
import tipsSplit from "./tips-split";
import fs from "fs"
import path from "path"
import {IComponentConfig} from "../@types";

async function componentsConfigure() {
    const components: IComponentConfig[] = []
    const { count } = await inquirer.prompt([
        {
            type: "number",
            message: "自定义组件数量",
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
                choices: fs.readdirSync(path.join(__dirname, "../templates"))
            },
        ])
        components.push(
            await require(path.join(__dirname, "../templates", templateId)).configurator()
        )
    }
    return components
}

export default componentsConfigure