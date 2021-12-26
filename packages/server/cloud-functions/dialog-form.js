const fs = require("fs")
const path = require("path")

const dialogForm = {
  schemas: fs.readFileSync(path.resolve("templates/schemas/dialog-form.ejs"), "utf8"),
  components({ name, data }) {
    return [
      {
        template: fs.readFileSync(path.resolve("templates/files/dialog-form.ejs"), "utf8"),
        name,
        data
      }
    ]
  },
  services({ name, data, utils }) {
    const { firstToUpperCase } = utils
    return [
      {
        name,
        services: [
          {
            name: "submit",
            method: "post",
            api: data.api,
          }
        ]
      }
    ]
  }
}

module.exports = dialogForm