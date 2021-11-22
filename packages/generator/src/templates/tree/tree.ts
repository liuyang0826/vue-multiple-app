
import { injectTemplate } from "../../utils"

const template = `
<el-tree :data="treeData" :props="{children: '<%children%>', label: '<%label%>'}" node-key="<%id%>" @node-click="handleNodeClick" default-expand-all empty-text="暂无数据" highlight-current></el-tree>
`
export default ({ id, label, children }: any) => injectTemplate(template, {id, label, children}, 2)
