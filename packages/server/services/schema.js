const fs = require("fs")
const path = require("path")

async function getSchemaById(ctx, next) {
    const id = ctx.query.id
    ctx.type = "js"
    ctx.sendSchema()
}

module.exports = {
    getSchemaById
}