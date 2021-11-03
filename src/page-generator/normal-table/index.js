const searchForm = require("./search-form")
const table = require("./table")
const pagination = require("./pagination")
const handleButton = require("./handle-button")
const { injectTemplate, makeCamelCase } = require("../utils")

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

const descriptions = [
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

const process = ({ name, options: { formItems, tableCols, hasPagination, hasBatchDel, addForm, updateForm } }) => {
    const pipeMethods = [
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

    const services = [
        {
            name: "getTableData",
            method: "get",
            api: "/api/list"
        },
    ]

    if (hasPagination) {
        pipeMethods.push(`usePager({ onChange: "handleSearch" })`)
    }

    if (addForm) {
        addForm.parentOptions.namespace = "add"
    }

    if (updateForm) {
        updateForm.parentOptions.namespace = "update"
    }

    if (formItems) {
        formItems.filter(d => d.type === "select").forEach((item) => {
            const dep = item.dep && `query.${formItems.find(d => d.id === item.dep).props.prop}`
            if (dep) {
                item.props.disabled = ` :disabled="!${dep}"`
            }
            pipeMethods.push(
                `useSelectOptions({
    namespace: "${item.props.prop}",
    options: [${item.options ? "\n      " : ""}${item.options
                    ?.map(({value, label}) => `{ value: "${value}", label: "${label}" }`)
                    .join(",\n      ") || ""}${item.options ? "\n    " : ""}]${item.api ? `,\n    immediate: ${item.immediate || false},
    async getOptions () {
      const { status, data, message } = await ${makeCamelCase("get", item.props.prop, "options")}()
      if (status) {
        this.${item.props.prop}Options = data
      } else {
        this.$message.error(message)
      }
    }` : ""}${dep ? `,\n    dep: "${dep}"` : ""}
  })`
            )
            if (item.api) {
                services.push({
                    method: "get",
                    name: makeCamelCase("get", item.props.prop, "options"),
                    api: item.api
                })
            }
        })
    }


    return {
        options: {
            name,
            template: injectTemplate(template, {
                searchForm: searchForm({
                    formItems
                }),
                table: table({
                    tableCols
                }),
                pagination: hasPagination && pagination(),
                handleButton: handleButton({hasBatchDel, addForm}),
            }, 2),
            pipeMethods,
        },
        components: [addForm, updateForm].filter(Boolean),
        services
    }
}

const injectParent = () => {
    const pipeMethods = []

    const props = [
        `:data="subTableData"`,
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
