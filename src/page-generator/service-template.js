const { injectTemplate } = require("./utils")
const template = `<%template%>`

const fnTemplate =
`export const <%name%> = async () => {
  
}
`

module.exports = (services) => {
  return injectTemplate(template, {
      template: services.map((item) => injectTemplate(fnTemplate, item))
  })
}