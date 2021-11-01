const { injectTemplate } = require("../utils")

const template = `
<div>
  <el-button size="small" @click="handleBatchDel">批量删除</el-button>
  <el-button size="small" icon="el-icon-plus" @click="handleAdd" type="primary">添加</el-button>
</div>
`

module.exports = ({handleAdd, handleBatchDel}) => injectTemplate(template, {
    handleAdd,
    handleBatchDel,
}, 4)