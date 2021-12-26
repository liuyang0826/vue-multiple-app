const artTemplate = require('art-template');
const {firstToUpperCase, split, camelCaseToShortLine, firstToLowerCase} = require("../utils")
const parseDefaultFunction = require("../templates/imports/parse-default-function")
const some = require("../templates/imports/some")

const itemWidth = 260

function renderMiddlemare() {
  artTemplate.defaults.rules.pop()
  artTemplate.defaults.imports.firstToUpperCase = firstToUpperCase
  artTemplate.defaults.imports.firstToLowerCase = firstToLowerCase
  artTemplate.defaults.imports.camelCaseToShortLine = camelCaseToShortLine
  artTemplate.defaults.imports.split = split
  artTemplate.defaults.imports.parseDefaultFunction = parseDefaultFunction
  artTemplate.defaults.imports.some = some
  return async (ctx, next) => {
    artTemplate.defaults.imports.getFilePath = function (type, name) {
      const filename = name || ctx.state.filename
      if (ctx.state.isComponent) {
        if (type === "service") {
          return `../services/${camelCaseToShortLine(filename)}`
        } else {
          return `./${firstToUpperCase(filename)}.vue`
        }
      } else {
        if (type === "service") {
          return `./services/${camelCaseToShortLine(filename)}`
        } else {
          return `./components/${firstToUpperCase(filename)}.vue`
        }
      }
    }

    const map = new Map()
    artTemplate.defaults.imports.autoFormWidth = function (formItems) {
      if (!map.get(formItems)) {
        const formItemCount = formItems.length
        const cols = Math.ceil(formItemCount / 8)
        const labelWidths = Array.from({length: cols}).map((_, index) => {
          let maxLabel = 0
          for (let i = index; i < formItemCount; i += cols) {
            const item = formItems[i]
            const curWidth = item.label.length * 18 + 14 + (item.required ? 12 : 0) + (item.tips ? 16 : 0)
            if (curWidth > maxLabel) {
              maxLabel = curWidth
            }
          }
          return maxLabel
        })
        const labelWidth = {}
        formItems.forEach((item, index) => {
          labelWidth[index] = labelWidths[index % cols]
        })
        map.set(formItems, {
          labelWidth,
          itemWidth,
          dialogWidth: labelWidths.reduce((a, b) => a + b, 0) + itemWidth * cols + 40 + (cols - 1) * 10
        })
      }
      return map.get(formItems)
    }

    ctx.render = artTemplate.render
    await next()
  }
}

module.exports = renderMiddlemare