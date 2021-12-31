const fs = require("fs");
const { globAsync } = require("../../utils/async");

function exportProject(ctx) {
  return async (pages) => {
    const root = "project"
    await ctx.baseExport(root, async (archive) => {
      const filenames = await globAsync("templates/**/**.*")

      filenames.forEach((filename) => {
        archive.append(fs.createReadStream(filename), {
          name: `${root}/${filename.substr("templates/".length)}`
        })
      })

      await Promise.all(pages.map(({ component, service, name: pageName }) => {
        return ctx.pageWalker({ component, service }, ({ type, name, filename, code }) => {
          if (type === "component") {
            archive.append(Buffer.from(code), {
              name: `${[root, "src/views", pageName, name && "components", filename].filter(Boolean).join("/")}.vue`
            });
          } else {
            archive.append(Buffer.from(code), {
              name: `${[root, "src/views", pageName, "services", filename].filter(Boolean).join("/")}.js`
            });
          }
        })
      }))
    })
  }
}

module.exports = exportProject