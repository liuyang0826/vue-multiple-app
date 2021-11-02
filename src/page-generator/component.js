const fs = require("fs")
const path = require("path")

const baseTemplate = require("./base-template")
const { prettier, firstToLowerCase } = require("./utils")

function createFile(config) {
    const root = firstToLowerCase(config.name)
    const createComponent = (options, type) => {
        const data = prettier(baseTemplate(options))
        const fileName = type === "page" ? `Index.vue` : `components/${options.name}.vue`
        const rootDir = path.join(process.cwd(), `../packages/app-user/src/views/${root}`)
        if (!fs.existsSync(rootDir)) {
            fs.mkdirSync(rootDir)
        }
        const componentsDir = path.join(rootDir, "components")
        if (type !== "page" && !fs.existsSync(componentsDir)) {
            fs.mkdirSync(componentsDir)
        }
        fs.writeFileSync(path.join(rootDir, fileName), data)
    }

    const run = (config, type) => {
        const { options, components, services } = require(`./${config.templateId}`).process(config)
        createComponent(options, type);
        components.forEach((options) => {
            run(options, "component")
        })
    }
    run(config, "page")
}

module.exports = createFile