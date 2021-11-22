import { injectTemplate } from "../../utils"

const template = `
<div class="table-tool">
  <%batchDelButton%>
  <%addButton%>
</div>
`

interface IOperations {
    hasBatchDel: boolean
    addForm: boolean
}

export default ({ hasBatchDel, addForm }: IOperations) => {
    return hasBatchDel || addForm ? injectTemplate(template, {
        batchDelButton: hasBatchDel ? `<el-button size="mini" type="danger" plain :disabled="!selections.length" @click="handleBatchDelete">批量删除</el-button>` : " ",
        addButton: addForm ? `<el-button size="mini" icon="el-icon-plus" @click="handleAdd" type="primary">添加</el-button>` : " "
    }, 4) : " "
}
