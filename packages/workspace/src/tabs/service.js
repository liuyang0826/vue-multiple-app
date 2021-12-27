export default function service({name, data, resolveService}) {
  return {
    entry: {
      name
    },
    children: data.tabs.map((item) => resolveService(item.schemaId, {
      data: item.itemSchemas,
      name: item.name
    }))
  }
}