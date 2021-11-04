import searchForm from "./search-form"
import table from "./table"
import pagination from "./pagination"
import handleButton from "./handle-button"
import { injectTemplate } from "../../utils"
import processFormItems from "../utils/process-form-items"
import {IComponentConfig, IProcessTemplate, IService} from "../../@types";

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

export const descriptions = [
    {
        label: "查询表单项",
        prop: "formItems",
        type: "array",
        items: [
            { label: "名称", prop: "label" },
            { label: "字段名", prop: "prop" },
            { label: "最大长度", prop: "maxlength" },
            { label: "类型", prop: "itemType", type: "select", options: ["input", "select"] },
        ]
    },
    {
        label: "表格列",
        prop: "tableCols",
        type: "array",
        items: [
            { label: "名称", prop: "label" },
            { label: "字段名", prop: "prop" },
        ]
    },
    { label: "显示分页", prop: "hasPagination", type: "boolean" },
    {
        label: "新增弹窗",
        prop: "addDialog",
        type: "boolean",
        descriptions: [
            { label: "表单项", props: "formItems" }
        ]
    },
]

interface INormalTableOptions {
    formItems: any
    tableCols: any
    hasPagination: boolean
    hasBatchDel: boolean
    addForm: IComponentConfig
    updateForm: IComponentConfig
}

export const processTemplate: IProcessTemplate<INormalTableOptions> = ({ name, options}) => {
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

export const injectParent = () => {
    const hooks: string[] = []

    const props = [
        `:data="subTableData"`,
    ]

    return {
        hooks,
        props,
    }
}