const prettier = require("prettier")
const prettierOpt = require("../configs/prettier")
const cloudIdMap = require("../cloud-functions")

function schemaMiddleware() {
    return async (ctx, next) => {
        async function resolveSchema(cloudId) {
            const { template, data } = await cloudIdMap.get(cloudId).schema({
                resolveSchema
              })
            return ctx.render(template, data).replace(/<\/?script>/g, "")
        }
        ctx.sendSchema = async function(cloudId) {
            ctx.body = prettier.format(`window._resolveSchema(${(await resolveSchema(cloudId)).replace(/<\/?script>/g, "")})`, {
                prettierOpt,
                parser: "babel"
            })
        }
        await next()
    }
}


module.exports = schemaMiddleware