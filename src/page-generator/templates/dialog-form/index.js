const { injectTemplate } = require("../../utils")
const processFormItems = require("../utils/process-form-items")

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

const inputItemTemp = `
<el-form-item label="<%label%>：" prop="<%prop%>" label-width="<%labelWidth%>px">
  <el-input v-model="form.<%prop%>" maxlength="<%maxlength%>" />
</el-form-item>`

const selectItemTemp = `
<el-form-item label="<%label%>">
  <el-select clearable v-model="form.<%prop%>"<%disabled%>>
    <el-option v-for="{ label, value } in <%prop%>Options" :key="value" :label="label" :value="value"  />
  </el-select>
</el-form-item>`

const descriptions = [

]

const process = ({ name, options, parentOptions}) => {
    const { formItems, width = 440 } = options

    const requiredItems = formItems?.filter(d => d.props.required) || []

    const pipeMethods = [
        `useModalForm({
    onShow() {},
    formRules: {${requiredItems.length ? `\n      ${requiredItems.map(d => `${d.props.prop}: { required: true, message: "请输入${d.props.label}" }`)
            .join(",\n      ")}\n    ` : ""}},
    async onSubmit() {
      const { status, message } = await ${parentOptions.namespace}(this.form)
      if (status) {
        this.$message.error("操作成功")
        this.$emit("update:visible", false)
      } else {
        this.$message.error(message)
      }
    }
  })`
    ]
    const services = [
        {
            name: parentOptions.namespace,
            method: "post",
            api: `/api/${parentOptions.namespace}`
        }
    ]

    processFormItems({formItems, pipeMethods, services })

    return {
        options: {
            name,
            template: injectTemplate(template, ({
                formItems: formItems?.map(item => {
                    if (item.type === "input") {
                        return injectTemplate(inputItemTemp, {
                            labelWidth: 80,
                            ...item.props
                        }, 4)
                    }
                    if (item.type === "select") {
                        return injectTemplate(selectItemTemp, {
                            labelWidth: 80,
                            ...item.props
                        }, 4)
                    }
                }).join("\n") || " ",
                width,
            }), 2),
            pipeMethods,
        },
        components: [],
        services
    }
}

const injectParent = (options) => {
    const pipeMethods = [
        `useModalFormCtrl({ name: "${options.namespace}", title: "${options.title}" })`
    ]

    const props = [
        `:visible.sync="${options.namespace}Visible"`,
        `:data="${options.namespace}Form"`,
        `:title="${options.namespace}Title"`
    ]

    return {
        pipeMethods,
        props,
    }
}
module.exports = {
    process,
    descriptions,
    injectParent,
}
