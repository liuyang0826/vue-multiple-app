const artTemplate = require('art-template');
const {firstToUpperCase, split, camelCaseToShortLine, firstToLowerCase} = require("../utils")
const parseDefaultFunction = require("../templates/imports/parse-default-function")
const autoFormWidth = require("../templates/imports/auto-form-width")
const getFilePath = require("../templates/imports/get-file-path")
const some = require("../templates/imports/some")

function renderMiddlemare() {
  artTemplate.defaults.rules.pop()
  artTemplate.defaults.imports.firstToUpperCase = firstToUpperCase
  artTemplate.defaults.imports.firstToLowerCase = firstToLowerCase
  artTemplate.defaults.imports.camelCaseToShortLine = camelCaseToShortLine
  artTemplate.defaults.imports.split = split
  artTemplate.defaults.imports.parseDefaultFunction = parseDefaultFunction
  artTemplate.defaults.imports.some = some
  return async (ctx, next) => {
    artTemplate.defaults.imports.getFilePath = getFilePath(ctx.state)
    artTemplate.defaults.imports.autoFormWidth = autoFormWidth(new Map())
    ctx.render = artTemplate.render
    await next()
  }
}

module.exports = renderMiddlemare