import { injectTemplate } from "../../utils"

const template = `
<el-table size="small" :data="tableData" v-loading="searchLoading">
  <%tableCols%>
  <%operationCol%>
</el-table>
`

const tableColTemp = `
<el-table-column label="<%label%>" prop="<%prop%>" />`

const operationColTemp = `
<el-table-column label="操作">
  <template slot-scope="{row}">
    <%update%>
    <%delete%>
  </template>
</el-table-column>
`

export default ({ tableCols, hasUpdate, hasDelete }: any) => injectTemplate(template, {
    tableCols: tableCols?.map((item: any) => injectTemplate(tableColTemp, item, 2)).join("\n") || " ",
    operationCol: hasUpdate || hasDelete ? injectTemplate(operationColTemp, {
        update: hasUpdate ? `<el-button size="small" @click="handleUpdate(row)">编辑</el-button>` : " ",
        delete: hasDelete ? `<el-button size="small" @click="handleDelete(row)" type="danger">删除</el-button>` : " "
    }, 2) : " "
}, 2)
