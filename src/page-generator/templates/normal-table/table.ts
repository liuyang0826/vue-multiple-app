import { injectTemplate } from "../../utils"

const template = `
<el-table size="small" :data="tableData" v-loading="searchLoading">
  <%tableCols%>
  <%handleCol%>
</el-table>
`

const tableColTemp = `
<el-table-column label="<%label%>" prop="<%prop%>" />`

const handleColTemp = `
<el-table-column label="操作">
  <template slot-scope="{row}">
    <el-button size="small" @click="handleUpdate(row)">编辑</el-button>
    <el-button size="small" @click="handleDelete(row)" type="danger">删除</el-button>
  </template>
</el-table-column>
`

export default ({ tableCols }: any) => injectTemplate(template, {
    tableCols: tableCols?.map((item: any) => injectTemplate(tableColTemp, item, 2)).join("\n") || " ",
    handleCol: injectTemplate(handleColTemp, {}, 2)
}, 2)
