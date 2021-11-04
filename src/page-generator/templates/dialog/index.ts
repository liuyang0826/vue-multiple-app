import { injectTemplate } from "../../utils";

const template = `
<el-dialog :visible.sync="visible" :title="title" @close="$emit('update:visible', false)" width="<%width%>px">
  <%components%>
</el-dialog>
`

export const processTemplate = ({ name, options }: any) => {
    return {
        name,
        template: injectTemplate(template, options)
  }
}

export const injectParent = (config: any) => {
    const hooks = [
        `useModalFormCtrl({ name: "${config.namespace}", title: "${config.options.title}" })`
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