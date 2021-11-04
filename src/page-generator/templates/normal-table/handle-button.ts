import { injectTemplate } from "../../utils"

const template = `
<div>
  <%batchDelButton%>
  <%addButton%>
</div>
`

interface IHandleButton {
    hasBatchDel: boolean
    addForm: boolean
}

export default ({ hasBatchDel, addForm }: IHandleButton) => {
    return hasBatchDel || addForm ? injectTemplate(template, {
        batchDelButton: hasBatchDel ? `<el-button size="small" @click="handleBatchDel">批量删除</el-button>` : " ",
        addButton: addForm ? `<el-button size="small" icon="el-icon-plus" @click="handleAdd" type="primary">添加</el-button>` : " "
    }, 4) : " "
}
