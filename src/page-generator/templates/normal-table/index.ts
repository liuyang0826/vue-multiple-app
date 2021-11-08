import searchForm from "./search-form"
import table from "./table"
import pagination from "./pagination"
import handleButton from "./handle-button"
import {injectTemplate} from "../../utils"
import processFormItems from "../../utils/process-form-items"
import {
    IComponentConfig,
    IComponentEnum,
    IInjectParent,
    IProcessTemplate,
    IService,
    ITemplateDesc,
    ITemplateForm
} from "../../@types";

const template = `
<div>
  <div>
    <%searchForm%>
    <%handleButton%>
  </div>
  <%table%>
  <%pagination%>
  <%components%>
</div>
`

interface INormalTableOptions {
    formItems: any
    tableCols: any
    hasPagination: boolean
    hasBatchDel: boolean
    addForm: IComponentConfig
    updateForm: IComponentConfig
}

export const processTemplate: IProcessTemplate<INormalTableOptions> = ({ name, options}, type) => {
    const {
        formItems,
        tableCols,
        hasPagination,
        hasBatchDel,
        addForm,
        updateForm
    } = options

    const hooks = [
        `useSearch({
    async getTableData() {
      const { status, data, message } = await getTableData()
      if (status) {
        this.tableData = data
      } else {
        this.$message.error(message)
      }
    },
    immediate: true
  })`,
    ]

    if (type === IComponentEnum.component) {
        hooks.unshift(
            `injectProps({
    data: Object
  })`
        )
    }

    const services: IService[] = [
        {
            name: "getTableData",
            method: "get",
            api: "/api/list"
        },
    ]

    if (hasPagination) {
        hooks.push(`usePager({ onChange: "handleSearch" })`)
    }

    if (addForm) {
        addForm.namespace = "add"
    }

    if (updateForm) {
        updateForm.namespace = "update"
    }

    processFormItems({ formItems, hooks, services })

    return {
        name,
        template: injectTemplate(template, {
            searchForm: searchForm({
                formItems
            }),
            table: table({
                tableCols
            }),
            pagination: hasPagination && pagination(),
            handleButton: handleButton({
                hasBatchDel,
                addForm: !!addForm
            }),
        }, 2),
        hooks,
        components: [addForm, updateForm].filter(Boolean),
        services
    }
}

export const injectParent: IInjectParent = ({ namespace }) => {
    const hooks: string[] = [
        `injectData({
    ${namespace}TableData: {}
  })`
    ]

    const props = [ `:data="${namespace}TableData"` ]

    return {
        hooks,
        props,
    }
}

export const description: ITemplateDesc = {
    name: "表格",
    templateForm: [
        {
            label: "查询字段",
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
                { label: "名称", prop: "label", type: "text" },
                { label: "字段名", prop: "prop", type: "text" },
                { label: "最大长度", prop: "maxlength", type: "number" },
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
            ],
        },
        {
            label: "表格列",
            prop: "tableCols",
            type: "array",
            items: [
                { label: "名称", prop: "label", type: "text" },
                { label: "字段名", prop: "prop", type: "text" },
            ]
        },
        { label: "显示分页", prop: "hasPagination", type: "boolean" },
        {
            label: "新增弹窗",
            prop: "addForm",
            type: "component",
            templateId: "dialog-form"
        },
        {
            label: "编辑弹窗",
            prop: "updateForm",
            type: "component",
            templateId: "dialog-form"
        },
    ]
}
