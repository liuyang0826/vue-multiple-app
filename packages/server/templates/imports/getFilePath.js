const utils = require("../../utils")

function getFilePath(state) {
  return (type, name) => {
    const filename = name || state.filename
    if (state.isComponent) {
      if (type === "service") {
        return `../services/${utils.firstToLowerCase(filename)}`
      } else {
        return `./${name ? state.pathPrefix : ""}${utils.firstToUpperCase(filename)}.vue`
      }
    } else {
      if (type === "service") {
        return `./services/${utils.firstToLowerCase(filename)}`
      } else {
        return `./components/${utils.firstToUpperCase(filename)}.vue`
      }
    }
  }
}

module.exports = getFilePath