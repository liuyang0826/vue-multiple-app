function exportPage(ctx) {
  return async ({component, service}) => {
    const root = "page"
    await ctx.baseExport(root, async (archive) => {
      await ctx.pageWalker({ component, service }, ({ type, name, filename, code }) => {
        if (type === "component") {
          archive.append(Buffer.from(code), {
            name: `${[root, name && "components", filename].filter(Boolean).join("/")}.vue`
          });
        } else {
          archive.append(Buffer.from(code), {
            name: `${[root, "services", filename].filter(Boolean).join("/")}.js`
          });
        }
      })
    })
  }
}

module.exports = exportPage