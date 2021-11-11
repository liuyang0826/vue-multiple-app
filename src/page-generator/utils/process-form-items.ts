import { IFormItem, IService } from "../@types";
import { judgeType } from "../utils";

const { makeCamelCase } = require("../utils")

interface IProcessFormItemsProps {
    formItems?: IFormItem[]
    hooks: string[]
    services: IService[]
    depForm: string
}

const processFormItems = ({ formItems, hooks, services, depForm }: IProcessFormItemsProps) => {
    if (!formItems) {
        return
    }

    // 处理下拉框
    formItems.filter(d => judgeType(d.type)).forEach((item) => {
        const deps = item.deps?.map(d => `"${depForm}.${item.deps}"`).join(", ")
        hooks.push(
            `useSelectOptions({
    // ${item.label}选项
    namespace: "${item.prop}",
    options: [${item.options ? "\n      " : ""}${item.options
                ?.map(({value, label}) => `{ value: "${value}", label: "${label}" }`)
                .join(",\n      ") || ""}${item.options ? "\n    " : ""}]${item.api ? `,
    async getOptions() {
      const { status, data, message } = await ${makeCamelCase("get", item.prop, "options")}()
      if (status) {
        this.${item.prop}Options = data
      } else {
        this.$message.error(message)
      }
    }` : ""}${deps ? `,\n    deps: [${deps}]` : ""}
  })`
        )
        if (item.api) {
            services.push({
                method: "get",
                name: makeCamelCase("get", item.prop, "options"),
                api: item.api
            })
        }
    })
}

export default processFormItems
