const cloudIdMap = require("../cloud-functions")
const utils  = require("../utils")
const fs  = require("fs")
const path  = require("path")

// 获取 schema
async function getSchemaById(ctx) {
  const schemas = (await cloudIdMap.get(ctx.query.id)).schemas.replace(/<\/?script>/g, "")
  ctx.sendSchema(schemas, ctx.query.cb)
}

// 提交创建页面
async function submit(ctx) {
  const data = ctx.request.body
  fs.writeFileSync(path.resolve("schema.json"), JSON.stringify(data, null, 2), "utf8")
  const { components, services } = cloudIdMap.get(ctx.query.id)

  function resolveComponents(cloudId, { name, data }) {
    const { components } = cloudIdMap.get(cloudId)
    return components({ name: utils.firstToUpperCase(name), data, resolveComponents })
  }

  function resolveServices(cloudId, { name, data }) {
    const { services } = cloudIdMap.get(cloudId)
    return services({ name: utils.firstToUpperCase(name), data, utils, resolveServices })
  }

  await ctx.create({
    root: "test",
    components: components({data, resolveComponents}),
    services: services({ data, utils, resolveServices })
  })
  ctx.body = "success"
}

// 上传云函数
async function uploadCloudFounction(ctx) {
  ctx.body = "success"
}

async function getHistoryForm(ctx) {
  ctx.type = "json"
  ctx.body = fs.readFileSync(path.resolve("schema.json"), "utf8")
}

module.exports = {
  getSchemaById,
  submit,
  uploadCloudFounction,
  getHistoryForm,
}