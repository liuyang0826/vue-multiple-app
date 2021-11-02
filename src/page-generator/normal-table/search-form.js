const { injectTemplate } = require("../utils")

const template = `
<el-form size="small" :model="query" inline>
  <%formItems%>
  <el-form-item>
    <el-button @click="handleSearch" type="primary">查询</el-button>
  </el-form-item>
</el-form>
`

const formItemTemp = `
<el-form-item label="<%label%>">
  <el-input v-model="query.<%prop%>" maxlength="<%maxlength%>" />
</el-form-item>`

module.exports = ({formItems}) => injectTemplate(template, {
    formItems: formItems?.map(d => injectTemplate(formItemTemp, d, 2)).join("\n") || " ",
}, 4)