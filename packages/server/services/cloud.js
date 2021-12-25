const cloudIdMap = require("../cloud-functions")
const utils  = require("../utils")

// 获取 schema
async function getSchemaById(ctx) {
  async function resolveSchema(cloudId) {
    const { template, data } = await cloudIdMap.get(cloudId).schema({
        resolveSchema
      })
    return ctx.render(template, data).replace(/<\/?script>/g, "")
  }
  ctx.sendSchema(await resolveSchema(ctx.query.id), ctx.query.cb)
}

// 提交创建页面
async function submit(ctx) {
  const data = ctx.request.body
  const { template, components, services } = cloudIdMap.get("table")

  await ctx.create({
    root: "test",
    template,
    components: await components({
      data,
      resolveTemplate: cloudId => cloudIdMap.get(cloudId).template
    }),
    services: services({ data, utils })
  }, data)
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