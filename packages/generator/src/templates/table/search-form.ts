import { injectTemplate } from "../../utils"

const template = `
<el-form size="mini" inline style="flex: 1;">
  <%formItems%>
  <el-form-item>
    <el-button @click="handleSearch" type="primary">查询</el-button>
  </el-form-item>
</el-form>
`

const inputItemTemp = `
<el-form-item label="<%label%>">
  <el-input clearable v-model="query.<%prop%>"<%maxlength%> @change="handleSearch" />
</el-form-item>`

const selectItemTemp = `
<el-form-item label="<%label%>">
  <el-select clearable v-model="query.<%prop%>" style="width: 100%;" @change="handleSearch" <%disabled%>>
    <el-option v-for="{ label, value } in <%prop%>Options" :key="value" :label="label" :value="value"  />
  </el-select>
</el-form-item>`

const dateItemTemp = `
<el-form-item label="<%label%>">
  <el-date-picker type="<%dateType%>" v-model="query.<%prop%>" :editable="false"></el-date-picker>
</el-form-item>`

export default ({formItems}: any) => formItems?.length ? injectTemplate(template, {
    formItems: formItems?.map((item: any) => {
        if (item.type === "input") {
          return injectTemplate(inputItemTemp, item, 2)
        }
        if (item.type === "select") {
          return injectTemplate(selectItemTemp, item, 2)
        }
        if (item.type === "date") {
          return injectTemplate(dateItemTemp, item, 2)
        }
    }).join("\n") || " ",
}, 4) : " "
