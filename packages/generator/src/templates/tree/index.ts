import searchInput from "./search-input"
import tree from "./tree"
import { IInjectParent, IConfigurator, IProcessTemplate, IService } from "../../@types";
import basePrompt from "../../utils/base-prompt";
import inquirer from "inquirer";
import { injectTemplate } from "../../utils"
import { propValidator, requiredValidator } from "../../utils/validators";


export const templateId = "tree"

const template = `
<div class="tree-content">
  <%searchInput%>
  <%tree%>
</div>
`

const searchHookTemplate = `
useTreeCurd({
  async doSearch() {
    const { status, data, message } = await getTreeData({
      keywords: this.keywords
    })
    if (status) {
      this.treeData = data
    } else {
      this.$message.error(message)
    }
  },
  immediate: true<%doDelete%>
})`

interface ITreeOptions {
  id: string
  label: string
  children: string
  api: string
  required: boolean
  // addForm: IComponentConfig
  // updateForm: IComponentConfig
}

export const processTemplate: IProcessTemplate<ITreeOptions> = ({ name, options }) => {
  const { id, label, children, api, required } = options

  const services: IService[] = [
    {
        name: "getTreeData",
        method: "post",
        api
    }
  ]

  const hooks = [
    injectTemplate(searchHookTemplate, {}, 2),
  `useMethods({
    handleNodeClick(data) {
      console.log(data);
    }
  })`
  ]

  return {
      name,
      template: injectTemplate(template, {
        searchInput: searchInput(required),
        tree: tree({
          id,
          label,
          children
        }),
      }, 2),
      hooks,
      services
  }
}

export const configurator: IConfigurator<ITreeOptions> = async () => {
  const result = await basePrompt<ITreeOptions>({ templateId: "tree" })

  const item = await inquirer.prompt([
      {
        type: "input",
        message: "唯一识别属性key:",
        name: "id",
        default: "id",
        validate: propValidator
      },
      {
        type: "input",
        message: "节点名称(英文):",
        name: "label",
        default: "label",
        validate: propValidator
      },
      {
        type: "input",
        message: "子节点属性值(英文):",
        name: "children",
        default: "children",
        validate: propValidator
      },
      {
        type: "confirm",
        message: `是否支持搜索:`,
        name: `required`,
        default: true
      },
      {
        type: "input",
        message: "数据接口:",
        name: "api",
        validate: requiredValidator
      }
  ])

  result.options = item

  return result
}


export const injectParent: IInjectParent = () => {
  const hooks: string[] = []

  const props: any[] = []

  return {
      hooks,
      props,
  }
}
