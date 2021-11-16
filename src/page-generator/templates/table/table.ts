import { injectTemplate } from "../../utils"

const template = `
<el-table size="small" :data="tableData" v-loading="searchLoading"<%selectEvents%>>
  <%selection%>
  <%orderIndex%>
  <%tableCols%>
  <%operationCol%>
</el-table>
`

const tableColTemp = `
<el-table-column label="<%label%>" prop="<%prop%>" />`

const operationColTemp = `
<el-table-column label="操作" width="<%width%>">
  <template slot-scope="{row}">
    <%operations%>
  </template>
</el-table-column>
`

export default ({ tableCols, hasIndex, hasUpdate, hasDelete, hasToggleEnable, hasMove, hasSelection }: any) => {
    const operations = [
        hasUpdate && `<el-button size="small" type="text" @click="handleUpdate(row)">编辑</el-button>`,
        hasDelete && `<el-button size="small" type="text" @click="handleDelete(row)">删除</el-button>`,
        hasToggleEnable && `<el-button size="small" type="text" @click="handleToggleEnable(row)">{{ row.enable ? "禁用" : "启用" }}</el-button>`,
        hasMove && `<el-button size="small" type="text" @click="handleMove(row, 1)">上移</el-button>`,
        hasMove && `<el-button size="small" type="text" @click="handleMove(row, 0)">下移</el-button>`,
    ].filter(Boolean)
    return injectTemplate(template, {
        tableCols: tableCols?.map((item: any) => injectTemplate(tableColTemp, item, 2)).join("\n") || " ",
        orderIndex: hasIndex ? `<el-table-column type="index" label="序号" width="55" />` : " ",
        selection: hasSelection ? `<el-table-column type="selection" width="55" align="center" />` : " ",
        selectEvents: hasSelection ? ` ref="table" @select="handleSelect" @select-all="handleSelectAll"` : "",
        operationCol: operations.length ? injectTemplate(operationColTemp, {
            operations: operations.join(`\n    <el-divider direction="vertical"/>\n    `),
            width: operations.length * 44
        }, 2) : " "
    }, 2)
}
