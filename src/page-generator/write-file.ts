import fs from "fs"
import path from "path"
import vueTemplate from "./vue-template"
import serviceTemplate from "./service-template"
import { prettier, firstToLowerCase, camelCaseToShortLine } from "./utils"
import {IComponentConfig, IComponentTypeEnum} from "./@types";
import {getContext} from "./scanner";

function getRootDir(name: string): string {
    const rootDir = path.join(getContext().root, "views", `${name}`)
    if (fs.existsSync(rootDir)) {
        return getRootDir(name + "_copy")
    }
    return rootDir
}

const writeFile = (config: IComponentConfig) => {
    const rootDir = getRootDir(firstToLowerCase(config.name))
    fs.mkdirSync(rootDir)

    fs.writeFileSync(path.join(rootDir, "generator-config.json"), JSON.stringify(config, null, 2))

    const createVue = (config: IComponentConfig, type: IComponentTypeEnum) => {
        const { template, components, services } = vueTemplate(config, type)
        const fileName = type === IComponentTypeEnum.page
            ? `Index.vue`
            : `components/${config.name}.vue`
        if (type !== IComponentTypeEnum.page) {
            const componentsDir = path.join(rootDir, "components")
            if (!fs.existsSync(componentsDir)) {
                fs.mkdirSync(componentsDir)
            }
        }
        fs.writeFileSync(path.join(rootDir, fileName), prettier(template))
        components.forEach((config) => {
            createVue(config, IComponentTypeEnum.component)
        })

        if (services?.length) {
            const serviceFileName = type === IComponentTypeEnum.page ? "index" : camelCaseToShortLine(config.name)
            const servicesDir = path.join(rootDir, "services")
            if (!fs.existsSync(servicesDir)) {
                fs.mkdirSync(servicesDir)
            }
            fs.writeFileSync(path.join(servicesDir, `${serviceFileName}.js`), serviceTemplate(services))
        }
    }

    createVue(config, IComponentTypeEnum.page)
}

export default writeFile
