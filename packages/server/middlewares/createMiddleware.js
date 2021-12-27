const prettier = require("prettier");
const fs = require("fs")
const path = require("path")
const prettierOpt = require("../configs/prettier.js")
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

async function resolveWalker(promise, cb) {
  async function fn({entry, children}, prefix = "") {
    if (prefix) {
      entry.name = prefix + entry.name
    }
    await cb(entry)
    if (children && children.filter(Boolean).length) {
      for (let i = 0; i < children.length; i++) {
        const item = children[i]
        await fn(await item, entry.name)
      }
    }
  }
  await fn(await promise)
}

function createMiddleware() {
  return async (ctx, next) => {
    ctx.create = async function ({component, service, root}) {
      const {rootDir, componentsDir, servicesDir} = await prepareDir(root)

      await resolveWalker(component, async ({template, data, name}) => {
        ctx.state.isComponent = !!name
        const filename = ctx.state.filename = name || "Index"
        ctx.state.pathPrefix = name
        await writeFileSync(
          path.resolve(name ? componentsDir : rootDir, `${filename}.vue`),
          prettier.format(
            ctx.render(template, data).replace(/\n\s+\n/g, "\n"), {
              ...prettierOpt,
              parser: "vue"
            }
          )
        )
      })

      await resolveWalker(service, async ({name, services}) => {
        if (!services || !services.length) {
          return
        }
        ctx.state.isComponent = !!name
        const filename = ctx.state.filename = name ? utils.firstToLowerCase(name) : "index"
        ctx.state.pathPrefix = name
        await writeFileSync(
          path.resolve(servicesDir, `${filename}.js`),
          prettier.format(
            ctx.render(serviceTemplate, {
              services: services.filter(Boolean)
            }).replace(/\n\s+\n/g, "\n"), {
              ...prettierOpt,
              parser: "babel"
            }
          )
        )
      })

    }
    await next()
  }
}

module.exports = createMiddleware