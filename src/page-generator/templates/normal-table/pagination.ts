import { injectTemplate } from "../../utils"

const template = `
<el-pagination
  style="margin-top: 16px;"
  small
  background
  :total="total"
  :page-size="pageSize"
  :current-page="pageNum"
  @sizeChange="handleSizeChange"
  @currentChange="handleCurrentChange"
/>
`

export default () => injectTemplate(template, {}, 2)
