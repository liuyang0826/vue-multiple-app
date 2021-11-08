import {camelCaseToShortLine, injectTemplate} from "../../utils"
import {IComponentConfig, IInjectParent, IProcessTemplate} from "../../@types";
import baseConfigure from "../../utils/base-configure";
import inquirer from "inquirer";
import tipsSplit from "../../utils/tips-split";
import fs from "fs";
import path from "path";
import {componentsTemplate} from "../../vue-template";

const template = `
<el-tabs v-model="activeName" @tab-click="handleClick">
  <%tabPanes%>
</el-tabs>
`

const tabPaneTemplate = `
<el-tab-pane label="<%label%>" name="<%name%>">
  <%component%>
</el-tab-pane>`

interface ITabsOptions {
    tabPanes: {
        label: string
        name: string
        component: IComponentConfig
    }[]
}

export const processTemplate: IProcessTemplate<ITabsOptions> = ({ name, options, components }) => {
    const { tabPanes } = options

    const hooks: string[] = [
        `useData({
    activeName: "${tabPanes[0].name}"
  })`,
        `useMethods({
    handleClick() {
    
    }
  })`
    ]

    tabPanes.forEach((item) => {
      item.component.namespace = item.name
    })

    const injectParents = tabPanes
        .map((item) => require(`../${item.component.templateId}`)
            .injectParent(item.component)) as ReturnType<IInjectParent>[]

    return {
        name,
        template: injectTemplate(template, {
            tabPanes: tabPanes.map((item, index) => {
                const props = injectParents[index].props || []
                return injectTemplate(tabPaneTemplate, {
                    ...item,
                    component: injectTemplate(componentsTemplate, {
                        component: camelCaseToShortLine(item.component.name),
                        props: props.length ?` ${injectParents[index].props?.join(" ")} ` : " "
                    })
                }, 2)
            }).join("\n  ")
        }, 2),
        hooks,
        components: tabPanes.map(d => d.component)
    }
}

export async function configurator() {
    const result = await baseConfigure<ITabsOptions>({ templateId: "tabs" })

    const { count } = await inquirer.prompt([
        {
            type: "number",
            message: "tab个数:",
            name: "count",
            default: 2
        },
    ])

    const options: ITabsOptions = {
        tabPanes: []
    }

    result.options = options

    for (let i = 0; i < count; i++) {
        tipsSplit({ split: `tab-pane ${i + 1}` })
        const { name, label, templateId } = await inquirer.prompt([
            {
                type: "input",
                message: "name",
                name: "name",
            },
            {
                type: "input",
                message: "label",
                name: "label",
            },
            {
                type: "list",
                message: "组件模板",
                name: "templateId",
                choices: fs.readdirSync(path.join(__dirname, "../"))
            },
        ])

        options.tabPanes.push({
            name,
            label,
            component: await require(path.join(__dirname, "../", templateId)).configurator()
        })
    }

    return result
}