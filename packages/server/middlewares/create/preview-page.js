const path = require("path");
const { writeFileAsync } = require("../../utils/async");
const prepareDir = require("../../utils/prepare-dir");

function previewPage(ctx) {
  return async (root, {component, service}) => {
    ctx.status = 200
    const {rootDir, componentsDir, servicesDir} = await prepareDir(root)

    await ctx.pageWalker({ component, service }, async ({type, name, filename, code}) => {
      if (type === "component") {
        await writeFileAsync(
          path.resolve(name ? componentsDir : rootDir, `${filename}.vue`),
          code
        )
      } else {
        await writeFileAsync(
          path.resolve(servicesDir, `${filename}.js`),
          code
        )
      }
    })
  }
}

module.exports = previewPage