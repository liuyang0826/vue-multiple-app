const prettier = require("prettier")
const prettierOpt = require("../configs/prettier")

function schemaMiddleware() {
    return async (ctx, next) => {
        ctx.sendSchema = async function(schema) {
            ctx.type = "js"
            ctx.body = prettier.format(`window._resolveSchema(${schema})`, {
                prettierOpt,
                parser: "babel"
            })
        }
        await next()
    }
}


module.exports = schemaMiddleware