const { injectTemplate } = require("../utils")

const template = `
<el-form size="small" :model="query" inline>
  <%formItems%>
  <el-form-item>
    <el-button @click="handleSearch" type="primary">查询</el-button>
  </el-form-item>
</el-form>
`

const inputItemTemp = `
<el-form-item label="<%label%>">
  <el-input clearable v-model="query.<%prop%>" maxlength="<%maxlength%>" />
</el-form-item>`

const selectItemTemp = `
<el-form-item label="<%label%>">
  <el-select clearable v-model="query.<%prop%>"<%disabled%>>
    <el-option v-for="{ label, value } in <%prop%>Options" :key="value" :label="label" :value="value"  />
  </el-select>
</el-form-item>`

module.exports = ({formItems}) => injectTemplate(template, {
    formItems: formItems?.map(item => {
        if (item.type === "input") {
            return injectTemplate(inputItemTemp, item.props, 2)
        }
        if (item.type === "select") {
            return injectTemplate(selectItemTemp, item.props, 2)
        }
    }).join("\n") || " ",
}, 4)