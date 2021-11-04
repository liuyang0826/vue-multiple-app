const { injectTemplate } = require("../../utils")

const template = `
<div>
  <%batchDelButton%>
  <%addButton%>
</div>
`

module.exports = ({ hasBatchDel, addForm }) => {
    return hasBatchDel || addForm ? injectTemplate(template, {
        batchDelButton: hasBatchDel ? `<el-button size="small" @click="handleBatchDel">批量删除</el-button>` : " ",
        addButton: addForm ? `<el-button size="small" icon="el-icon-plus" @click="handleAdd" type="primary">添加</el-button>` : " "
    }, 4) : " "
}
