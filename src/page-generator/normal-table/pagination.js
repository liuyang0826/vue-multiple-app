const { injectTemplate } = require("../utils")

const template = `
<el-pagination
  style="margin-top: 16px;"
  small
  background
  :total="<%total%>"
  :page-size="<%pageSize%>"
  :current-page="<%pageNum%>"
  @sizeChange="<%handleSizeChange%>"
  @currentChange="<%handleCurrentChange%>"
/>
`

module.exports = ({ total, pageSize, pageNum, handleSizeChange, handleCurrentChange }) => injectTemplate(template, { total, pageSize, pageNum, handleSizeChange, handleCurrentChange }, 2)