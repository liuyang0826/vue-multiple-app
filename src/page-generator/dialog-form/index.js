const { injectTemplate } = require("../utils")

const template = `
<el-dialog :visible.sync="visible" :title="title" @close="$emit('update:visible', false)" width="<%width%>px">
  <el-form :model="form" size="small" :rules="formRules" ref="form">
     <%formItems%>
  </el-form>
  <template #footer>
    <el-button size="small" @click="$emit('update:visible', false)">取消</el-button>
    <el-button size="small" type="primary" :loading="formLoading" @click="handleSubmit">确定</el-button>
  </template>
  <%components%>
</el-dialog>
`

const formItemTemp = `
<el-form-item label="<%label%>：" prop="<%prop%>" label-width="<%labelWidth%>px">
  <el-input v-model="form.<%prop%>" maxlength="<%maxlength%>" />
</el-form-item>`

const descriptions = [

]

const process = ({ name, options}) => {
    const { formItems, width = 440 } = options

    const pipeMethods = [
        `useModalForm({
    onShow() {},
    formRules: {
      ${formItems?.filter(d => d.required).map(d => `${d.prop}: { required: true, message: "请输入${d.label}" }`).join(",\n      ")}
    },
    async onSubmit() {}
  })`
    ]
    const serviceImports = []
    const utilImports = new Set(["useModalForm"])
    const componentImports = new Set()


    return {
        options: {
            name,
            template: injectTemplate(template, ({
                formItems: formItems?.map(d => injectTemplate(formItemTemp, {
                    labelWidth: 80,
                    ...d
                }, 4)).join("\n") || " ",
                width,
            }), 2),
            pipeMethods,
            componentImports: [...componentImports],
            utilImports: [...utilImports],
            serviceImports,
        },
        components: [],
        services: []
    }
}

const injectParent = (options) => {
    const utilImports = []
    const pipeMethods = []
    utilImports.push("useModalFormCtrl")
    pipeMethods.push(`useModalFormCtrl({ name: "${options.namespace}", title: "${options.title}" })`)

    const props = [`:visible.sync="${options.namespace}Visible"`, `:data="${options.namespace}Form"`, `:title="${options.namespace}Title"`]

    return {
        utilImports,
        pipeMethods,
        props,
    }
}
module.exports = {
    process,
    descriptions,
    injectParent,
}