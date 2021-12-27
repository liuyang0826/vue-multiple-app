import template from "./template.ejs"

export default function component({name, data, resolveComponent}) {
  return {
    entry: {
      template,
      name,
      data,
    },
    children: data.tabs.map((item) => {
      return resolveComponent(item.schemaId, {
        data: item.itemSchemas,
        name: item.name,
      })
    })
  }
}