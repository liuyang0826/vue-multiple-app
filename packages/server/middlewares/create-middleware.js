const prettier = require("prettier");
const fs = require("fs")
const path = require("path")
const prettierOpt = require("../configs/prettier.js")

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

function createMiddleware() {
  return async (ctx, next) => {
    ctx.create = async function ({components, services, root}) {
      const {rootDir, componentsDir, servicesDir} = await prepareDir(root)
      for (let i = 0; i < components.length; i++) {
        const {template, data, name} = components[i]
        ctx.state.isComponent = !!i
        const filename = ctx.state.filename = i === 0 ? "Index" : name
        await writeFileSync(
          path.resolve(name ? componentsDir : rootDir, `${filename}.vue`),
          prettier.format(
            ctx.render(template, data).replace(/\n\s+\n/g, "\n"), {
              ...prettierOpt,
              parser: "vue"
            }
          )
        )
      }

      for (let i = 0; i < services.length; i++) {
        if (!services[i]) {
          continue
        }
        const {name, services: service} = services[i]
        ctx.state.isComponent = !!i
        const filename = ctx.state.filename = i === 0 ? "index" : name
        if (!service || !service.length) {
          continue
        }
        await writeFileSync(
          path.resolve(servicesDir, `${filename}.js`),
          prettier.format(
            ctx.render(serviceTemplate, {
              services: service.filter(Boolean)
            }).replace(/\n\s+\n/g, "\n"), {
              ...prettierOpt,
              parser: "babel"
            }
          )
        )
      }
    }
    await next()
  }
}

module.exports = createMiddleware