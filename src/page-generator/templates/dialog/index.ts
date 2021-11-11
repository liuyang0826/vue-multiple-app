import { injectTemplate } from "../../utils";
import { IProcessTemplate } from "../../@types";

export const templateId = "dialog"

export const componentOnly = true

const template = `
<el-dialog :visible.sync="visible" :title="title" @close="$emit('update:visible', false)" width="<%width%>px">
  <%components%>
</el-dialog>
`

export const processTemplate: IProcessTemplate<{}> = ({ name, options }) => {
    return {
        name,
        template: injectTemplate(template, options, 2),
        hooks: [
            `useModal({})`
        ]
  }
}

export const injectParent = (config: any) => {
    const hooks = [
        `useModalCtrl({ name: "${config.namespace}", title: "${config.options.title}" })`
    ]

    const props = [
        `:visible.sync="${config.namespace}Visible"`,
        `:data="${config.namespace}Data"`,
        `:title="${config.namespace}Title"`
    ]

    return {
        hooks,
        props,
    }
}