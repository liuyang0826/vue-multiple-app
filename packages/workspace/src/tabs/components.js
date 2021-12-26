import template from "./template.ejs"

export default function components({name, data, resolveComponents}) {
  return [
    {
      template,
      name,
      data,
    },
    ...data.tabs.map((item) => {
      return resolveComponents(item.schemaId, {
        data: item.itemSchemas,
        name: item.name,
      })
    })
  ]
}