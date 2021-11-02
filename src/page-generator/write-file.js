const fs = require("fs")
const path = require("path")

const baseTemplate = require("./base-template")
const serviceTemplate = require("./service-template")
const { prettier, firstToLowerCase, componentNameToTagName } = require("./utils")

const writeFile = (config) => {
    const root = firstToLowerCase(config.name)
    const rootDir = path.join(process.cwd(), `../packages/app-user/src/views/${root}`)
    if (!fs.existsSync(rootDir)) {
        fs.mkdirSync(rootDir)
    }

    const rootName = config.name

    const createService = (fileName, services) => {
        if (!services?.length) {
            return
        }

        const realFileName = fileName === rootName
            ? `services/index.js` : `services/${componentNameToTagName(config.name)}.js`

        fs.writeFileSync(path.join(rootDir, realFileName), prettier(serviceTemplate(services)))
    }

    const createComponent = (config, type) => {
        const { template, components, services } = baseTemplate(config, type)
        const fileName = type === "page"
            ? `Index.vue`
            : `components/${config.name}.vue`
        const componentsDir = path.join(rootDir, "components")
        if (type !== "page" && !fs.existsSync(componentsDir)) {
            fs.mkdirSync(componentsDir)
        }
        fs.writeFileSync(path.join(rootDir, fileName), prettier(template))
        components.forEach((config) => {
            createComponent(config, "component")
        })
        createService(config.name, services)
    }
    createComponent(config, "page")
}

module.exports = writeFile