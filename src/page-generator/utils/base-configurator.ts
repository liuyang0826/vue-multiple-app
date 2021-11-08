import {IComponentConfig} from "../@types";
import inquirer from "inquirer";

async function baseConfigurator<T>({ templateId = "" }) {
    const config = {
        templateId,
    } as IComponentConfig<T>

    config.name = (await inquirer.prompt([
        {
            type: "input",
            message: "组件名称:",
            name: "name",
            filter: (val: string) => val.replace(/\b(\w)(\w*)/, ($0, $1, $2) => $1.toUpperCase() + $2),
            validate: (input) => /^[\w]+$/.test(input)
        }
    ])).name

    return config
}

export default baseConfigurator