import { injectTemplate } from "../../utils"

const template = `
<el-input size="small prefix-icon="el-icon-search" placeholder="关键字搜索" v-model="keywords" clearable :maxlength="100" @change="handleSearch" />
`

export default (hasSearch: boolean) => hasSearch ? injectTemplate(template, {}, 2) : ""
