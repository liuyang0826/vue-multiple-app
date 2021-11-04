const fs = require("fs")
const path = require("path")

const vueTemplate = require("./vue-template")
const serviceTemplate = require("./service-template")
const { prettier, firstToLowerCase, camelCaseToShortLine } = require("./utils")

const writeFile = (config) => {
    const rootDir = path.join(process.cwd(), `../packages/app-user/src/views/${firstToLowerCase(config.name)}`)
    if (!fs.existsSync(rootDir)) {
        fs.mkdirSync(rootDir)
    }
    // const pageServices = []

    const createService = (fileName, services) => {
        if (!services?.length) {
            return
        }
        fs.writeFileSync(path.join(rootDir, "services/index.js"), serviceTemplate(services))
    }

    const createVue = (config, type) => {
        const { template, components, services } = vueTemplate(config, type)
        const fileName = type === "page"
            ? `Index.vue`
            : `components/${config.name}.vue`
        if (type !== "page") {
            const componentsDir = path.join(rootDir, "components")
            if (!fs.existsSync(componentsDir)) {
                fs.mkdirSync(componentsDir)
            }
        }
        fs.writeFileSync(path.join(rootDir, fileName), prettier(template))
        components.forEach((config) => {
            createVue(config, "component")
        })
        createService(config.name, services)

        if (services?.length) {
            const serviceFileName = type === "page"
                ? "index"
                : camelCaseToShortLine(config.name)

            fs.writeFileSync(path.join(rootDir, `services/${serviceFileName}.js`), serviceTemplate(services))
        }
        // pageServices.unshift(...services)
    }

    createVue(config, "page")

    // createService(config.name, pageServices)
}

module.exports = writeFile
