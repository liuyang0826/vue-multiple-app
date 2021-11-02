const searchForm = require("./search-form")
const table = require("./table")
const pagination = require("./pagination")
const headerButton = require("./header-button")
const dialogForm = require("./dialog-form")
const { injectTemplate, componentNameToTagName } = require("../utils")

const template = `
<div>
  <div>
    <%searchForm%>
    <%headerButton%>
  </div>
  <%table%>
  <%pagination%>
  <%addDialogForm%>
  <%editDialogForm%>
  <%components%>
</div>
`

const makeCustomOptions = ({ formItems, tableCols, hasPagination, addDialog, editDialog, components }) => {
    return {
        searchForm: searchForm({
            formItems
        }),
        headerButton: headerButton({
            handleAdd: "handleAdd",
            handleBatchDel: "handleBatchDel",
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
        addDialogForm: addDialog && dialogForm({
            visible: "addVisible",
            tag: componentNameToTagName(addDialog.name),
            data: "addForm",
            title: "addTitle",
        }),
        editDialogForm: editDialog && dialogForm({
            visible: "editVisible",
            tag: componentNameToTagName(editDialog.name),
            data: "editForm",
            title: "editTitle",
        }),
        components: components.map(d => `<${componentNameToTagName(d.name)} />`).join("\n  ")
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

const process = ({ name, formItems, tableCols, hasPagination, addDialog, editDialog, components }) => {
    const pipeMethods = [
        `useSearch({
    async getTableData() {
      const data = await getTableData()
      this.tableData = data
    },
    immediate: true
  })`,
    ]

    const utilImports = new Set([
        "useSearch",
        "injectComponents",
    ])

    const componentImports = new Set(components.map(d => d.name))

    const serviceImports = ["getTableData"]

    if (hasPagination) {
        utilImports.add("usePager")
        pipeMethods.push("usePager()")
    }

    if (addDialog) {
        componentImports.add(addDialog.name)
        utilImports.add("useModalFormCtrl")
        pipeMethods.push(`useModalFormCtrl({ name: "add", title: "新增" })`)
    }

    if (editDialog) {
        componentImports.add(editDialog.name)
        utilImports.add("useModalFormCtrl")
        pipeMethods.push(`useModalFormCtrl({ name: "edit", title: "编辑" })`)
    }

    pipeMethods.push(`injectComponents({ ${[...componentImports].join(", ")} })`)

    return {
        options: {
            name,
            template: injectTemplate(template, makeCustomOptions({
                formItems,
                tableCols,
                hasPagination,
                addDialog,
                editDialog,
                components,
            }), 2),
            pipeMethods,
            componentImports: [...componentImports],
            utilImports: [...utilImports],
            serviceImports,
        },
        components: [...components, addDialog, editDialog].filter(Boolean),
        services: []
    }
}

module.exports = {
    process,
    descriptions,
}