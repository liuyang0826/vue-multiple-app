const prettier = require("prettier")
const prettierOpt = require("../configs/prettier")

function schemaMiddleware() {
    return async (ctx, next) => {
        ctx.sendSchema = async function(source) {
            ctx.body = prettier.format(`window._resolveSchema(${(await ctx.render("schemas/table", {
                writeResp: false
            })).replace(/<\/?script>/g, "")})`, {
                ...prettierOpt,
                parser: "babel"
            })
        }
        await next()
    }
}

module.exports = schemaMiddleware