const prettier = require("prettier")
const prettierOpt = require("../configs/prettier")

function schemaMiddleware() {
    return async (ctx, next) => {
        ctx.sendSchema = async function(schema, cb) {
            ctx.type = "js"
            ctx.body = prettier.format(`window["${cb}"](${schema})`, {
                prettierOpt,
                parser: "babel"
            })
        }
        await next()
    }
}


module.exports = schemaMiddleware