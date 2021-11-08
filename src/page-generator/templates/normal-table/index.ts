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
    IService
} from "../../@types";
import inquirer from "inquirer"
import baseConfigure from "../../utils/base-configure";
import tipsSplit from "../../utils/tips-split";
import componentsConfigure from "../../utils/components-configure";

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
            `useProps({
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
        `useData({
    ${namespace}TableData: {}
  })`
    ]

    const props = [ `:data="${namespace}TableData"` ]

    return {
        hooks,
        props,
    }
}

export async function configurator() {
    const result = await baseConfigure<INormalTableOptions>({ templateId: "normal-table" })

    const { tableCols } = await inquirer.prompt([
        {
            type: "number",
            message: "表格列数:",
            name: "tableCols",
            default: 1,
        },
    ])

    const options = {} as INormalTableOptions

    result.options = options

    options.tableCols = await promptTableCols({ prefix: "表格列", length: tableCols })

    const { useSearchForm, formItems } = await inquirer.prompt([
        {
            type: "confirm",
            message: "添加查询表单？",
            name: "useSearchForm",
            default: false
        },
        {
            type: "number",
            message: "个数:",
            name: "formItems",
            default: 0,
            prefix: "表单项",
            when: (answer) => answer.useSearchForm
        },
    ])

    if (useSearchForm) {
        options.formItems = await promptFormItems({ length: formItems })
    }

    const { hasPagination, operations } = await inquirer.prompt([
        {
            type: "confirm",
            message: "是否分页？",
            name: "hasPagination",
            default: true
        },
        {
            type: "checkbox",
            message: "功能操作？",
            name: "operations",
            default: false,
            choices: [
                { name: "新增", checked: true },
                { name: "编辑" },
            ]
        },
    ])

    options.hasPagination = hasPagination

    if (operations.includes("新增")) {
        tipsSplit({ split: `新增弹窗` })
        options.addForm = await require("../dialog-form").configurator()
    }

    if (operations.includes("编辑")) {
        tipsSplit({ split: `编辑弹窗` })
        options.updateForm = await require("../dialog-form").configurator()
    }

    result.components = await componentsConfigure()

    return result
}

async function promptTableCols({ prefix = "表单项", length = 0 }) {
    const result = []

    for (let i = 0; i < length; i++) {
        tipsSplit({ split: `${prefix}${i + 1}` })
        const item = await inquirer.prompt([
            {
                type: "input",
                message: `label:`,
                name: `label`,
            },
            {
                type: "input",
                message: `prop:`,
                name: `prop`,
            },
        ])
        result.push(item)
    }

    return result
}

export async function promptFormItems({ prefix = "表单项", length = 0 }) {
    const result = []

    for (let i = 0; i < length; i++) {
        tipsSplit({ split: `${prefix}${i + 1}` })
        const item = await inquirer.prompt([
            {
                type: "list",
                message: `类型:`,
                name: "type",
                choices: ["input", "select"],
            },
            {
                type: "input",
                message: `label:`,
                name: `label`,
            },
            {
                type: "input",
                message: `prop:`,
                name: `prop`,
            },
            {
                type: "list",
                message: `数据源类型:`,
                name: "source",
                choices: ["接口", "固定项"],
                when: (answer: any) => answer.type === "select"
            },
            {
                type: "input",
                message: `数据源接口:`,
                name: "api",
                when: (answer: any) => answer.type === "select" && answer.source === "接口"
            },
            {
                type: "input",
                message: `数据源依赖表单项prop:`,
                name: "dep",
                default: "无",
                when: (answer: any) => answer.type === "select" && answer.source === "接口"
            },
            {
                type: "number",
                message: `固定项个数:`,
                name: "count",
                default: 0,
                when: (answer: any) => answer.type === "select" && answer.source === "固定项"
            },
        ])
        const length = item.count

        if (length) {
            item.options = await promptSelectOptions({ length, prefix: `${prefix}${i + 1}选项` })
        }

        if (!item.dep || item.dep === "无") {
            delete item.dep
        }

        result.push(item)
    }

    return result
}

async function promptSelectOptions({ prefix = '', length = 0 }) {
    const result = []

    for (let i = 0; i < length; i++) {
        tipsSplit({ split: `${prefix}${i + 1}`})
        result[i] = await inquirer.prompt([
            {
                type: "input",
                message: `label:`,
                name: "label",
            },
            {
                type: "input",
                message: `value:`,
                name: "value",
            },
        ])
    }

    return result
}