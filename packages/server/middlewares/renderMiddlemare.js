const artTemplate = require('art-template');
const {firstToUpperCase, camelCaseToShortLine, firstToLowerCase} = require("../utils")
const parseDefaultFunction = require("../utils/imports/parseDefaultFunction")
const autoFormWidth = require("../utils/imports/autoFormWidth")
const getFilePath = require("../utils/imports/getFilePath")

function renderMiddlemare() {
  artTemplate.defaults.rules.pop()
  artTemplate.defaults.imports.firstToUpperCase = firstToUpperCase
  artTemplate.defaults.imports.firstToLowerCase = firstToLowerCase
  artTemplate.defaults.imports.camelCaseToShortLine = camelCaseToShortLine
  artTemplate.defaults.imports.parseDefaultFunction = parseDefaultFunction
  artTemplate.defaults.imports.split = (str, ...args) => String.prototype.split.call(str, ...args)
  return async (ctx, next) => {
    artTemplate.defaults.imports.getFilePath = getFilePath(ctx.state)
    artTemplate.defaults.imports.autoFormWidth = autoFormWidth(new Map())
    ctx.render = artTemplate.render
    await next()
  }
}

module.exports = renderMiddlemare