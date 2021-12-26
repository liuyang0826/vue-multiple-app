const cloudIdMap = require("../cloud-functions")
const utils  = require("../utils")

async function promiseFlatten(promise) {
  const result = []
  async function fn(list) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (item instanceof Promise) {
        await fn(await item)
      } else if (Array.isArray(item)) {
        await fn(item)
      } else {
        result.push(item)
      }
    }
  }
  await fn(await promise)
  return result
}

// 获取 schema
async function getSchemaById(ctx) {
  const schemas = (await cloudIdMap.get(ctx.query.id)).schemas.replace(/<\/?script>/g, "")
  ctx.sendSchema(schemas, ctx.query.cb)
}

// 提交创建页面
async function submit(ctx) {
  const data = ctx.request.body
  const { components, services } = cloudIdMap.get(ctx.query.id)

  function resolveComponents(cloudId, { name, data }) {
    const { components } = cloudIdMap.get(cloudId)
    return components({ name: utils.firstToUpperCase(name), data, resolveComponents })
  }

  function resolveServices(cloudId, { name, data }) {
    const { services } = cloudIdMap.get(cloudId)
    return services({ name: utils.camelCaseToShortLine(name || ""), data, utils, resolveServices })
  }

  await ctx.create({
    root: "test",
    components: await promiseFlatten(components({data, resolveComponents})),
    services: services({ data, utils, resolveServices }).flat(Infinity)
  })
  ctx.body = "success"
}

// 上传云函数
async function uploadCloudFounction(ctx) {
  ctx.body = "success"
}

module.exports = {
  getSchemaById,
  submit,
  uploadCloudFounction
}