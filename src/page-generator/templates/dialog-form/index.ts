import { injectTemplate } from "../../utils"
import processFormItems from "../../utils/process-form-items"
import {
    IFormItem,
    IInjectParent,
    IProcessTemplate,
    IService,
    ITemplateDesc,
    ITemplateForm
} from "../../@types";

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

interface IDialogFormOptions {
    formItems: (IFormItem & {
        required: boolean
    })[]
    title: string
    width: number
    api: string
}

export const processTemplate: IProcessTemplate<IDialogFormOptions> = ({ name, options }) => {
    const { formItems, width = 440, api } = options

    const requiredItems = formItems?.filter((d) => d.required) || []

    const hooks = [
        `useModalForm({
    onShow() {},
    formRules: {${requiredItems.length ? `\n      ${requiredItems.map(d => `${d.prop}: { required: true, message: "请输入${d.label}", trigger: ["change", "blur"] }`)
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
                        ...item
                    }, 4)
                }
                if (item.type === "select") {
                    return injectTemplate(selectItemTemp, {
                        labelWidth: 80,
                        ...item
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
        `:data="${config.namespace}Data"`,
        `:title="${config.namespace}Title"`
    ]

    return {
        hooks,
        props,
    }
}

export const description: ITemplateDesc = {
    name: "弹窗表单",
    templateForm: [
        { label: "标题", prop: "title", type: "text" },
        {
            label: "表单项",
            prop: "formItems",
            type: "array",
            items: [
                {
                    label: "类型",
                    prop: "type",
                    type: "select",
                    options: [
                        { label: "输入框", value: "input" },
                        { label: "下拉框", value: "select" },
                    ]
                },
                {
                    label: "组件属性",
                    prop: "props",
                    type: "array",
                    items: [
                        { label: "名称", prop: "label", type: "text" },
                        { label: "字段名", prop: "prop", type: "text" },
                        { label: "最大长度", prop: "maxlength", type: "number" },
                    ]
                },
                {
                    label: "下拉选项",
                    prop: "options",
                    type: "array",
                    items: [
                        { label: "键", prop: "label", type: "text" },
                        { label: "值", prop: "value", type: "text" },
                    ]
                },
                { label: "下拉api", prop: "api", type: "text" },
                { label: "组件id", prop: "id", type: "text" },
                { label: "依赖控件id", prop: "dep", type: "text" },
            ]
        },
    ]
}
