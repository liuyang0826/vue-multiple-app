const fs = require("fs")
const path = require("path")

const dialogForm = {
  schemas: fs.readFileSync(path.resolve("templates/schemas/tabs.ejs"), "utf8"),
  async components({name, data, resolveComponents}) {
    return [
      {
        template: fs.readFileSync(path.resolve("templates/files/tabs.ejs"), "utf8"),
        name,
        data,
      },
      ...data.tabs.map((item) => {
        return resolveComponents(item.schemaId, {
          data: item.itemSchemas,
          name: item.componentName,
        })
      })
    ]
  },
  services({data, resolveServices}) {
    return [
      {},
      ...data.tabs.map((item) => resolveServices(item.schemaId, {
        data: item.itemSchemas,
        name: item.componentName
      }))
    ]
  }
}

module.exports = dialogForm