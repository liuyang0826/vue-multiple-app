import { injectTemplate } from "../../utils"

const template = `
<el-pagination
  style="margin-top: 12px;text-align: right;"
  small
  background
  layout="total, prev, pager, next, jumper"
  :total="total"
  :page-size="pageSize"
  :current-page="pageNum"
  @sizeChange="handleSizeChange"
  @currentChange="handleCurrentChange"
/>
`

export default () => injectTemplate(template, {}, 2)
