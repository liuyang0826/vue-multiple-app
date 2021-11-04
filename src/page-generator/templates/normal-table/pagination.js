const { injectTemplate } = require("../../utils")

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

module.exports = () => injectTemplate(template, {}, 2)
