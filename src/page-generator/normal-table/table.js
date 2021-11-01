const { injectTemplate } = require("../utils")

const template = `
<el-table size="small" :data="tableData" v-loading="<%loading%>">
  <%tableCols%>
  <%handleCol%>
</el-table>
`

const tableColTemp = `
<el-table-column label="<%label%>" prop="<%prop%>" />`

const handleColTemp = `
<el-table-column label="操作">
  <template slot-scope="{row}">
    <el-button size="small" @click="handleEdit(row)">编辑</el-button>
    <el-button size="small" @click="handleEdit(row)" type="danger">删除</el-button>
  </template>
</el-table-column>
`

module.exports = ({ tableCols, loading }) => injectTemplate(template, {
    loading,
    tableCols: tableCols.map(item => injectTemplate(tableColTemp, item, 2)).join("\n"),
    handleCol: injectTemplate(handleColTemp, {}, 2)
}, 2)