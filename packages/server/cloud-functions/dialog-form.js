const fs = require("fs")
const path = require("path")

const dialogForm = {
  template: fs.readFileSync(path.resolve("templates/files/dialog-form.ejs"), "utf8"),
  schemaTemplate: fs.readFileSync(path.resolve("templates/schemas/dialog-form.ejs"), "utf8"),
  schema({ resolveSchema }) {
    return {
      template: dialogForm.schemaTemplate
    }
  },
  components({ data, resolveTemplate }) {
    return [

    ].filter(Boolean)
  },
  services({ data, utils }) {
    const { firstToUpperCase } = utils
    return [

    ].filter(Boolean)
  }
}

module.exports = dialogForm