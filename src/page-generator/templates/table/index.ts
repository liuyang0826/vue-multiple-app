import searchForm from "./search-form"
import table from "./table"
import pagination from "./pagination"
import handleButton from "./operations"
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
import basePrompt from "../../utils/base-prompt";
import tipsSplit from "../../utils/tips-split";
import componentsPrompt from "../../utils/components-prompt";
import {propValidator, requiredValidator} from "../../utils/validators";

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
    api: string
    tableCols: any
    hasPager: boolean
    deleteApi: string
    batchDeleteApi: string
    addForm: IComponentConfig
    updateForm: IComponentConfig
}

export const processTemplate: IProcessTemplate<INormalTableOptions> = ({ name, options}, type) => {
    const {
        formItems,
        api,
        tableCols,
        hasPager,
        deleteApi,
        batchDeleteApi,
        addForm,
        updateForm
    } = options

    const hooks = [
        `useSearch({
    async getTableData() {
      const { status, data, message } = await getTableData({
        query: this.query,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      })
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
            method: "post",
            api
        },
    ]

    if (hasPager) {
        hooks.push(`usePager({ onChange: "handleSearch" })`)
    }

    if (addForm) {
        addForm.namespace = "add"
    }

    if (updateForm) {
        updateForm.namespace = "update"
    }

    if (deleteApi) {
        services.push({
            name: "itemDelete",
            method: "post",
            api: deleteApi
        })
        hooks.push(
            `useDelete({
    async doDelete(row) {
      const { status, message } = await itemDelete(row)
      if (status) {
        this.$message.success("删除成功")
      } else {
        this.$message.error(message)
      }
    }     
  })`
        )
    }

    if (batchDeleteApi) {
        services.push({
            name: "batchDelete",
            method: "post",
            api: batchDeleteApi
        })
        hooks.push(
            `useDelete({
    async doBatchDelete(row) {
      const { status, message } = await batchDelete(row)
      if (status) {
        this.$message.success("删除成功")
      } else {
        this.$message.error(message)
      }
    }     
  })`
        )
    }

    processFormItems({ formItems, hooks, services })

    return {
        name,
        template: injectTemplate(template, {
            searchForm: searchForm({
                formItems
            }),
            table: table({
                tableCols,
                hasUpdate: !!updateForm,
                hasDelete: !!deleteApi
            }),
            pagination: hasPager && pagination(),
            handleButton: handleButton({
                hasBatchDel: !!batchDeleteApi,
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
    const result = await basePrompt<INormalTableOptions>({ templateId: "table" })

    const { tableCols } = await inquirer.prompt([
        {
            type: "number",
            message: "表格列数:",
            name: "tableCols",
            default: 1,
        },
    ])

    const options = {
        tableCols: (await promptTableCols({ prefix: "表格列", length: tableCols }))
    } as INormalTableOptions

    result.options = options

    const { api, formItems } = await inquirer.prompt([
        {
            type: "input",
            message: "数据接口:",
            name: "api",
            validate: requiredValidator
        },
        {
            type: "number",
            message: "查询表单项数量:",
            name: "formItems",
            default: 1,
            when: (answer) => answer.useSearchForm
        },
    ])

    options.api = api

    if (formItems) {
        options.formItems = await promptFormItems({ length: formItems })
    }

    const { operations } = await inquirer.prompt([
        {
            type: "checkbox",
            message: "功能操作？",
            name: "operations",
            choices: [
                { name: "分页", checked: true },
                { name: "新增", checked: true },
                { name: "编辑", checked: true },
                { name: "删除" },
                { name: "批量删除" },
                { name: "启用禁用" },
                { name: "上移下移" },
            ]
        },
    ])

    options.hasPager = operations.includes("分页")

    if (operations.includes("新增")) {
        tipsSplit({ split: `新增` })
        options.addForm = await require("../dialog-form").configurator()
    }

    if (operations.includes("编辑")) {
        tipsSplit({ split: `编辑` })
        options.updateForm = await require("../dialog-form").configurator()
    }

    if (operations.includes("删除")) {
        tipsSplit({ split: `删除` })
        const { deleteApi } = await inquirer.prompt([
            {
                type: "input",
                message: "删除接口:",
                name: "deleteApi",
                validate: requiredValidator
            }
        ])
        options.deleteApi = deleteApi
    }

    if (operations.includes("批量删除")) {
        tipsSplit({ split: `批量删除` })
        const { batchDeleteApi } = await inquirer.prompt([
            {
                type: "input",
                message: "批量删除接口:",
                name: "batchDeleteApi",
                validate: requiredValidator
            }
        ])
        options.batchDeleteApi = batchDeleteApi
    }

    result.components = await componentsPrompt()

    return result
}

async function promptTableCols({ prefix = "表单项", length = 0 }) {
    const result = []

    for (let i = 0; i < length; i++) {
        tipsSplit({ split: `${prefix}${i + 1}` })
        const item = await inquirer.prompt([
            {
                type: "input",
                message: `label(中文):`,
                name: `label`,
                validate: requiredValidator
            },
            {
                type: "input",
                message: `prop(英文):`,
                name: `prop`,
                validate: propValidator
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
                message: `label(中文):`,
                name: `label`,
                validate: requiredValidator,
            },
            {
                type: "input",
                message: `prop(英文):`,
                name: `prop`,
                validate: propValidator,
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
                message: `数据源接口api:`,
                name: "api",
                when: (answer: any) => answer.type === "select" && answer.source === "接口",
                validate: requiredValidator
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
                default: 2,
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
                message: `label(中文):`,
                name: "label",
                validate: requiredValidator,
            },
            {
                type: "input",
                message: `value(英文):`,
                name: "value",
                validate: propValidator,
            },
        ])
    }

    return result
}