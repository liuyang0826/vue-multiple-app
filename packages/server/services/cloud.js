async function getSchemaById(ctx) {
  ctx.sendSchema("table")
}

async function submit(ctx) {
  await ctx.create("table", ctx.request.body)
  ctx.body = "success"
}

module.exports = {
  getSchemaById,
  submit
}