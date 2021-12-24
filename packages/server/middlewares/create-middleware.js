const prettier = require("prettier");
const fs = require("fs")
const path = require("path")
const prettierOpt = require("../configs/prettier.js")

function createMiddleware() {
    return async (ctx, next) => {
        ctx.create = async function(template, data, options) {
            fs.writeFileSync(
                path.resolve(`../demo/src/views/${options.path}`),
                prettier.format((await ctx.render(`files/${template}`, {
                    ...data,
                    writeResp: false
                })).replace(/\n\s+\n/g, "\n"), {
                    ...prettierOpt,
                    parser: options.type === "vue" ? "vue" : "babel"
                }),
                "utf8"
            )
        }
        await next()
    }
}

module.exports = createMiddleware