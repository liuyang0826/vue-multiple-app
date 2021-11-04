import { injectTemplate } from "../../utils"
import processFormItems from "../utils/process-form-items"
import {IFormItem, IInjectParent, IProcessTemplate, IService} from "../../@types";

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

export const descriptions = [

]

interface IDialogFormOptions {
    formItems: IFormItem<{
        required: boolean
    }>[]
    title: string
    width: number
    api: string
}

export const processTemplate: IProcessTemplate<IDialogFormOptions> = ({ name, options }) => {
    const { formItems, width = 440, api } = options

    const requiredItems = formItems?.filter((d) => d.props.required) || []

    const hooks = [
        `useModalForm({
    onShow() {},
    formRules: {${requiredItems.length ? `\n      ${requiredItems.map(d => `${d.props.prop}: { required: true, message: "请输入${d.props.label}", trigger: ["change", "blur"] }`)
            .join(",\n      ")}\n    ` : ""}},
    async onSubmit() {
      const { status, message } = await doSubmit(this.form)
      if (status) {
        this.$message.error("操作成功")
        this.$emit("update:visible", false)
      } else {
        this.$message.error(message)
      }
    }
  })`
    ]
    const services: IService[] = [
        {
            name: "doSubmit",
            method: "post",
            api
        }
    ]

    processFormItems({formItems, hooks, services })

    return {
        name,
        template: injectTemplate(template, ({
            formItems: formItems?.map((item) => {
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
        hooks,
        components: [],
        services
    }
}

export const injectParent: IInjectParent<IDialogFormOptions> = (config) => {
    const hooks = [
        `useModalFormCtrl({ name: "${config.namespace}", title: "${config.options.title}" })`
    ]

    const props = [
        `:visible.sync="${config.namespace}Visible"`,
        `:data="${config.namespace}Form"`,
        `:title="${config.namespace}Title"`
    ]

    return {
        hooks,
        props,
    }
}
