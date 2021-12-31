const prettierOpt = require("../../configs/prettier");
const utils = require("../../utils");
const resolveWalker = require("../../utils/resolve-walker");
const prettier = require("prettier")

const serviceTemplate = `
import http from "@http"

<% services.forEach(function({ name, method, api }) { %>
    export const <%= name %> = async (params) => {
        return await http.<%= method %>("<%= api %>", params)
    }
<% }) %>
`

function pageWalker(ctx) {
  return async ({ component, service }, cb) => {
    await resolveWalker(component, async ({template, data, name}) => {
      ctx.state.isComponent = !!name
      const filename = ctx.state.filename = name || "Index"
      ctx.state.pathPrefix = name

      const code = prettier.format(
        ctx.render(template, data).replace(/\n\s+\n/g, "\n"), {
          ...prettierOpt,
          parser: "vue"
        }
      )

      await cb({
        type: "component",
        name,
        filename,
        code
      })
    })

    await resolveWalker(service, async ({name, services}) => {
      if (!services || !services.length) {
        return
      }
      ctx.state.isComponent = !!name
      const filename = ctx.state.filename = name ? utils.firstToLowerCase(name) : "index"
      ctx.state.pathPrefix = name

      const code = prettier.format(
        ctx.render(serviceTemplate, {
          services: services.filter(Boolean)
        }).replace(/\n\s+\n/g, "\n"), {
          ...prettierOpt,
          parser: "babel"
        }
      )
      await cb({
        type: "service",
        name,
        filename,
        code
      })
    })
  }
}

module.exports = pageWalker