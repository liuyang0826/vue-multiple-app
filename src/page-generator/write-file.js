const fs = require("fs")
const path = require("path")

const vueTemplate = require("./vue-template")
const serviceTemplate = require("./service-template")
const { prettier, firstToLowerCase, componentNameToTagName } = require("./utils")

const writeFile = (config) => {
    const root = firstToLowerCase(config.name)
    const rootDir = path.join(process.cwd(), `../packages/app-user/src/views/${root}`)
    if (!fs.existsSync(rootDir)) {
        fs.mkdirSync(rootDir)
    }
    const pageServices = []

    const createVue = (config, type) => {
        const { template, components, services } = vueTemplate(config, type)
        const fileName = type === "page"
            ? `Index.vue`
            : `components/${config.name}.vue`
        const componentsDir = path.join(rootDir, "components")
        if (type !== "page" && !fs.existsSync(componentsDir)) {
            fs.mkdirSync(componentsDir)
        }
        fs.writeFileSync(path.join(rootDir, fileName), prettier(template))
        components.forEach((config) => {
            createVue(config, "component")
        })
        pageServices.unshift(...services)
    }

    createVue(config, "page")

    const createService = (fileName, services) => {
        if (!services?.length) {
            return
        }
        fs.writeFileSync(path.join(rootDir, "services/index.js"), serviceTemplate(services))
    }

    createService(config.name, pageServices)
}

module.exports = writeFile
