const fs = require("fs")
const path = require("path")

const schemaTemplate = fs.readFileSync(path.resolve("templates/schemas/tabs.ejs"), "utf8")

const dialogForm = {
    template: fs.readFileSync(path.resolve("templates/files/tabs.ejs"), "utf8"),
    schemaTemplate: fs.readFileSync(path.resolve("templates/schemas/dialog-form.ejs"), "utf8"),
    schema({ resolveSchema }) {
        return {
            template: schemaTemplate
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