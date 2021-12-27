const utils  = require("../utils")
const fs  = require("fs")
const path  = require("path")

const cloudIdMap = new Map([
  ["dialog-form", require("../workspace/dialog-form")],
  ["table", require("../workspace/table")],
  ["tabs", require("../workspace/tabs")]
])

// 获取 schema
async function getSchemaById(ctx) {
  const schemas = (await cloudIdMap.get(ctx.query.id)).schemas.replace(/<\/?script>/g, "")
  ctx.sendSchema(schemas, ctx.query.cb)
}

// 提交创建页面
async function submit(ctx) {
  const data = ctx.request.body
  fs.writeFileSync(path.resolve("schema.json"), JSON.stringify(data, null, 2), "utf8")
  const { component, service } = cloudIdMap.get(ctx.query.id)

  function resolveComponent(cloudId, { name, data }) {
    const { component } = cloudIdMap.get(cloudId)
    return component({ name: utils.firstToUpperCase(name), data, resolveComponent })
  }

  function resolveService(cloudId, { name, data }) {
    const { service } = cloudIdMap.get(cloudId)
    return service({ name: utils.firstToUpperCase(name), data, utils, resolveService })
  }

  await ctx.create({
    root: "test",
    component: component({data, resolveComponent}),
    service: service({ data, utils, resolveService })
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