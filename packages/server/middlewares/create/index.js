const pageWalker = require("./page-walker")
const baseExport = require("./base-export")
const exportProject = require('./export-project')
const exportPage = require('./export-page')
const previewPage = require('./preview-page')

function createMiddleware() {
  return async (ctx, next) => {
    ctx.pageWalker = pageWalker(ctx)
    ctx.baseExport = baseExport(ctx)
    ctx.exportProject = exportProject(ctx)
    ctx.exportPage = exportPage(ctx)
    ctx.previewPage = previewPage(ctx)
    await next()
  }
}

module.exports = createMiddleware