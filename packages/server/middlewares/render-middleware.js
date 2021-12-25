const artTemplate = require('art-template');
const {firstToUpperCase, split} = require("../utils")
const parseDefaultFunction = require("../templates/imports/parse-default-function")
const some = require("../templates/imports/some")
const autoFormWidth = require("../templates/imports/auto-form-width")

function renderMiddlemare() {
  artTemplate.defaults.rules.pop()
  artTemplate.defaults.imports.firstToUpperCase = firstToUpperCase
  artTemplate.defaults.imports.split = split
  artTemplate.defaults.imports.parseDefaultFunction = parseDefaultFunction
  artTemplate.defaults.imports.some = some
  artTemplate.defaults.imports.autoFormWidth = autoFormWidth
  return async (ctx, next) => {
    ctx.render = artTemplate.render
    await next()
  }
}

module.exports = renderMiddlemare