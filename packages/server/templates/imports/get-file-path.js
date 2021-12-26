const {firstToUpperCase, camelCaseToShortLine} = require("../../utils")

function getFilePath(state) {
  return (type, name) => {
    const filename = name || state.filename
    if (state.isComponent) {
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
}

module.exports = getFilePath