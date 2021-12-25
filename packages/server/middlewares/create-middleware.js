const prettier = require("prettier");
const fs = require("fs")
const path = require("path")
const prettierOpt = require("../configs/prettier.js")
const cloudIdMap = require("../cloud-functions")
const utils  = require("../utils")

const serviceTemplate = fs.readFileSync(path.resolve("templates/files/service.ejs"), "utf8")

async function writeFileSync(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            err ? reject(err) : resolve()
        })
    })
}

async function mkdirSync(path) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, (err) => {
            err ? reject(err) : resolve()
        })
    })
}

async function prepareDir(root) {
    const rootDir = path.resolve(`../demo/src/views/${root}`)
    if (!fs.existsSync(rootDir)) {
        await mkdirSync(rootDir)   
    }
    const componentsDir = path.resolve(rootDir, "components")
    if (!fs.existsSync(componentsDir)) {
        await mkdirSync(componentsDir)   
    }
    const servicesDir = path.resolve(rootDir, "services")
    if (!fs.existsSync(servicesDir)) {
        await mkdirSync(servicesDir)   
    }
    return {
        rootDir,
        componentsDir,
        servicesDir
    }
}

async function resolveTemplate(cloudId) {
    return cloudIdMap.get(cloudId).template
}

function createMiddleware() {
    return async (ctx, next) => {
        ctx.create = async function(cloudId, data) {
            const { template, components, services } = cloudIdMap.get(cloudId)

            const { rootDir, componentsDir, servicesDir } = await prepareDir("test")

            await Promise.all([
                writeFileSync(
                    path.resolve(rootDir, "Index.vue"),
                    prettier.format(
                        ctx.render(template, data).replace(/\n\s+\n/g, "\n"), {
                            ...prettierOpt,
                            parser: "vue"
                        }
                    )
                ),
                ...(await components({ data, resolveTemplate })).map(({ template, data, name }) => writeFileSync(
                    path.resolve(componentsDir, `${name}.vue`),
                    prettier.format(
                        ctx.render(template, data).replace(/\n\s+\n/g, "\n"), {
                            ...prettierOpt,
                            parser: "vue"
                        }
                    ))
                ),
                writeFileSync(
                    path.resolve(servicesDir, "index.js"),
                    prettier.format(
                        ctx.render(serviceTemplate, {
                            services: services({ data, utils })
                        }).replace(/\n\s+\n/g, "\n"), {
                            ...prettierOpt,
                            parser: "babel"
                        }
                    )
                )
            ])
        }

        await next()
    }
}

module.exports = createMiddleware