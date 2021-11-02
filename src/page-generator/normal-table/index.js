const searchForm = require("./search-form")
const table = require("./table")
const pagination = require("./pagination")
const handleButton = require("./handle-button")
const { injectTemplate } = require("../utils")

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

const makeCustomOptions = ({ formItems, tableCols, hasPagination, hasBatchDel, addFormDialog }) => {
    return {
        searchForm: searchForm({
            formItems
        }),
        table: table({
            loading: "searchLoading",
            tableCols
        }),
        pagination: hasPagination && pagination({
            total: "total",
            pageSize: "pageSize",
            pageNum: "pageNum",
            handleCurrentChange: "handleCurrentChange",
            handleSizeChange: "handleSizeChange",
        }),
        handleButton: handleButton({hasBatchDel, addFormDialog}),
    }
}

const descriptions = [
    {
        label: "查询表单项",
        prop: "formItems",
        type: "array",
        items: [
            { label: "名称", prop: "label" },
            { label: "字段名", prop: "prop" },
            { label: "最大长度", prop: "maxlength" },
        ]
    },
    { label: "表格列", prop: "tableCols", type: "array" },
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

const process = ({ name, options }) => {
    const pipeMethods = [
        `useSearch({
    async getTableData() {
      const data = await getTableData()
      this.tableData = data
    },
    immediate: true
  })`,
    ]

    const utilImports = [
        "useSearch",
    ]

    const serviceImports = ["getTableData"]

    if (options.hasPagination) {
        utilImports.push("usePager")
        pipeMethods.push("usePager()")
    }

    if (options.addFormDialog) {
        options.addFormDialog.parentOptions.namespace = "add"
    }

    if (options.editFormDialog) {
        options.editFormDialog.parentOptions.namespace = "edit"
    }

    return {
        options: {
            name,
            template: injectTemplate(template, makeCustomOptions(options), 2),
            pipeMethods,
            utilImports,
            serviceImports,
        },
        components: [options.addFormDialog, options.editFormDialog].filter(Boolean),
        services: [{
            name: "getTableData"
        }]
    }
}

module.exports = {
    process,
    descriptions,
}