import {camelCaseToShortLine, injectTemplate} from "../../utils"
import {IComponentConfig, IConfigurator, IInjectParent, IProcessTemplate} from "../../@types";
import basePrompt from "../../utils/base-prompt";
import inquirer from "inquirer";
import tipsSplit from "../../utils/tips-split";
import {makeComponentCode} from "../../vue-template";
import {propValidator, requiredValidator} from "../../utils/validators";
import {getTemplateById, getTemplates} from "../../scanner";

export const templateId = "tabs"

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
        `useData(function() {
      return {
        activeName: "${tabPanes[0].name}"
      }
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
        .map((item) => getTemplateById(item.component.templateId)!.injectParent(item.component))
    injectParents.forEach(({ hooks: injectHooks }) => {
        hooks.push(...injectHooks)
    })

    return {
        name,
        template: injectTemplate(template, {
            tabPanes: tabPanes.map((item, index) => {
                return injectTemplate(tabPaneTemplate, {
                    ...item,
                    component: makeComponentCode({
                        name: item.component.name,
                        props: injectParents[index].props,
                    }, 2)
                })
            }).join("\n  ")
        }, 2),
        hooks,
        components: tabPanes.map(d => d.component)
    }
}

export const configurator: IConfigurator<ITabsOptions> = async () => {
    const result = await basePrompt<ITabsOptions>({ templateId: "tabs" })

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
                message: "name(英文)",
                name: "name",
                validate: propValidator
            },
            {
                type: "input",
                message: "label(中文)",
                name: "label",
                validate: requiredValidator
            },
            {
                type: "list",
                message: "组件模板",
                name: "templateId",
                choices: getTemplates().filter(d => !d.componentOnly).map(d => d.templateId)
            },
        ])

        options.tabPanes.push({
            name,
            label,
            component: await getTemplateById(templateId)!.configurator()
        })
    }

    return result
}