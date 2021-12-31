const utils  = require("../utils")
const fs  = require("fs")
const path  = require("path")

const cloudIdMap = new Map([
  ["dialog-form", require("../workspace/dialog-form")],
  ["table", require("../workspace/table")],
  ["tabs", require("../workspace/tabs")],
  ["tree", require("../workspace/tree")]
])

// 获取 schema
async function getSchemaById(ctx) {
  const schemas = (await cloudIdMap.get(ctx.query.id)).schemas
  ctx.sendSchema(schemas, ctx.query.cb)
}

// 提交创建页面
async function previewPage(ctx) {
  const data = ctx.request.body
  fs.writeFileSync(path.resolve("history.json"), JSON.stringify(data, null, 2), "utf8")

  const { component, service } = cloudIdMap.get(ctx.query.id)

  function resolveComponent(cloudId, { name, data }) {
    const { component } = cloudIdMap.get(cloudId)
    return component({ name: utils.firstToUpperCase(name), data, resolveComponent })
  }

  function resolveService(cloudId, { name, data }) {
    const { service } = cloudIdMap.get(cloudId)
    return service({ name: utils.firstToUpperCase(name), data, utils, resolveService })
  }

  await ctx.previewPage("test", {
    component: component({data, resolveComponent}),
    service: service({ data, utils, resolveService })
  })
}

// 导出项目
async function exportProject(ctx) {
  const data = require(path.resolve("history.json"))
  fs.writeFileSync(path.resolve("history.json"), JSON.stringify(data, null, 2), "utf8")

  const { component, service } = cloudIdMap.get(ctx.query.id)

  function resolveComponent(cloudId, { name, data }) {
    const { component } = cloudIdMap.get(cloudId)
    return component({ name: utils.firstToUpperCase(name), data, resolveComponent })
  }

  function resolveService(cloudId, { name, data }) {
    const { service } = cloudIdMap.get(cloudId)
    return service({ name: utils.firstToUpperCase(name), data, utils, resolveService })
  }

  await ctx.exportProject([
    {
      name: "test",
      component: component({data, resolveComponent}),
      service: service({ data, utils, resolveService })
    }
  ])
}

// 导出页面
async function exportPage(ctx) {
  const data = require(path.resolve("history.json"))
  fs.writeFileSync(path.resolve("history.json"), JSON.stringify(data, null, 2), "utf8")

  const { component, service } = cloudIdMap.get(ctx.query.id)

  function resolveComponent(cloudId, { name, data }) {
    const { component } = cloudIdMap.get(cloudId)
    return component({ name: utils.firstToUpperCase(name), data, resolveComponent })
  }

  function resolveService(cloudId, { name, data }) {
    const { service } = cloudIdMap.get(cloudId)
    return service({ name: utils.firstToUpperCase(name), data, utils, resolveService })
  }

  await ctx.exportPage({
    name: "test",
    component: component({data, resolveComponent}),
    service: service({ data, utils, resolveService })
  })
}

// 上传云函数
async function uploadCloudFounction(ctx) {
  ctx.body = "success"
}

async function getHistoryForm(ctx) {
  ctx.type = "json"
  ctx.body = fs.readFileSync(path.resolve("history.json"), "utf8")
}

async function getAllSchemas(ctx) {
  ctx.type = "json"
  ctx.body = JSON.stringify([
    { name: "表格", id: "table" },
    { name: "标签页", id: "tabs" },
    { name: "左右布局", id: "tree" },
  ])
}

module.exports = {
  getSchemaById,
  previewPage,
  exportProject,
  exportPage,
  uploadCloudFounction,
  getHistoryForm,
  getAllSchemas,
}