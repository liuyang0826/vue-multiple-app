import fs from "fs"
import path from "path"
import vueTemplate from "./vue-template"
import serviceTemplate from "./service-template"
import { prettier, firstToLowerCase, camelCaseToShortLine } from "./utils"
import {IComponentConfig, IComponentEnum} from "./@types";

function getRootDir(name: string): string {
    const rootDir = path.join(process.cwd(), `./packages/app-user/src/views/${name}`)
    if (fs.existsSync(rootDir)) {
        return getRootDir(name + "_copy")
    }
    return rootDir
}

const writeFile = (config: IComponentConfig) => {
    const rootDir = getRootDir(firstToLowerCase(config.name))
    fs.mkdirSync(rootDir)

    fs.writeFileSync(path.join(rootDir, "generator-config.json"), JSON.stringify(config, null, 2))

    const createVue = (config: IComponentConfig, type: IComponentEnum) => {
        const { template, components, services } = vueTemplate(config, type)
        const fileName = type === IComponentEnum.page
            ? `Index.vue`
            : `components/${config.name}.vue`
        if (type !== IComponentEnum.page) {
            const componentsDir = path.join(rootDir, "components")
            if (!fs.existsSync(componentsDir)) {
                fs.mkdirSync(componentsDir)
            }
        }
        fs.writeFileSync(path.join(rootDir, fileName), prettier(template))
        components.forEach((config) => {
            createVue(config, IComponentEnum.component)
        })

        if (services?.length) {
            const serviceFileName = type === IComponentEnum.page ? "index" : camelCaseToShortLine(config.name)
            const servicesDir = path.join(rootDir, "services")
            if (!fs.existsSync(servicesDir)) {
                fs.mkdirSync(servicesDir)
            }
            fs.writeFileSync(path.join(servicesDir, `${serviceFileName}.js`), serviceTemplate(services))
        }
    }

    createVue(config, IComponentEnum.page)
}

export default writeFile
