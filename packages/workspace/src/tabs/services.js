export default function services({data, resolveServices}) {
  return [
    {},
    ...data.tabs.map((item) => resolveServices(item.schemaId, {
      data: item.itemSchemas,
      name: item.name
    }))
  ]
}