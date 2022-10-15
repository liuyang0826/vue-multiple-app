const fs = require("fs")
const async = require("./async")
const path = require("path")

async function prepareDir(root) {
  const rootDir = path.resolve(`../preview/src/views/${root}`)
  if (!fs.existsSync(rootDir)) {
    await async.mkdirAsync(rootDir)
  }
  const componentsDir = path.resolve(rootDir, "components")
  if (!fs.existsSync(componentsDir)) {
    await async.mkdirAsync(componentsDir)
  }
  const servicesDir = path.resolve(rootDir, "services")
  if (!fs.existsSync(servicesDir)) {
    await async.mkdirAsync(servicesDir)
  }
  return {
    rootDir,
    componentsDir,
    servicesDir
  }
}

module.exports = prepareDir