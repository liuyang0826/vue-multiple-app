import { IFormItem, IService } from "../../@types";

const { makeCamelCase } = require("../../utils")

interface IProcessFormItemsProps {
    formItems?: IFormItem[]
    hooks: string[]
    services: IService[]
}

const processFormItems = ({ formItems, hooks, services  }: IProcessFormItemsProps) => {
    if (!formItems) {
        return
    }

    // 处理下拉框
    formItems.filter(d => d.type === "select").forEach((item) => {
        const dep = item.dep && `query.${formItems.find(d => d.id === item.dep)?.props?.prop}`
        if (dep) {
            item.props.disabled = ` :disabled="!${dep}"`
        }
        hooks.push(
            `useSelectOptions({
    namespace: "${item.props.prop}",
    options: [${item.options ? "\n      " : ""}${item.options
                ?.map(({value, label}) => `{ value: "${value}", label: "${label}" }`)
                .join(",\n      ") || ""}${item.options ? "\n    " : ""}]${item.api ? `,
    async getOptions() {
      const { status, data, message } = await ${makeCamelCase("get", item.props.prop, "options")}()
      if (status) {
        this.${item.props.prop}Options = data
      } else {
        this.$message.error(message)
      }
    }` : ""}${dep ? `,\n    dep: "${dep}"` : ""}
  })`
        )
        if (item.api) {
            services.push({
                method: "get",
                name: makeCamelCase("get", item.props.prop, "options"),
                api: item.api
            })
        }
    })
}

export default processFormItems