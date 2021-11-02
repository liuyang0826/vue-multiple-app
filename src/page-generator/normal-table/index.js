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

const process = ({ name, options: { formItems, tableCols, hasPagination, hasBatchDel, addForm, updateForm } }) => {
    const pipeMethods = [
        `useSearch({
    async getTableData() {
      const data = await getTableData()
      this.tableData = data
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
        pipeMethods.push("usePager()")
    }

    if (addForm) {
        addForm.parentOptions.namespace = "add"
    }

    if (updateForm) {
        updateForm.parentOptions.namespace = "update"
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
        `:data="addForm"`,
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
