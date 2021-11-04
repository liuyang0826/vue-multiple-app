const { makeCamelCase } = require("../../utils")

const processFormItems = ({ formItems, pipeMethods,services  }) => {
    if (!formItems) {
        return
    }

    // 处理下拉框
    formItems.filter(d => d.type === "select").forEach((item) => {
        const dep = item.dep && `query.${formItems.find(d => d.id === item.dep).props.prop}`
        if (dep) {
            item.props.disabled = ` :disabled="!${dep}"`
        }
        pipeMethods.push(
            `useSelectOptions({
    namespace: "${item.props.prop}",
    options: [${item.options ? "\n      " : ""}${item.options
                ?.map(({value, label}) => `{ value: "${value}", label: "${label}" }`)
                .join(",\n      ") || ""}${item.options ? "\n    " : ""}]${item.api ? `,\n    immediate: true,
    async getOptions () {
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

module.exports = processFormItems