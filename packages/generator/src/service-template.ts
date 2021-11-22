import { injectTemplate } from "./utils"
const template =
`import http from "@/http"
// const http = () => {}

<%template%>`

const fnTemplate =
`export const <%name%> = async (params) => {
  return await http.<%method%>("<%api%>", params)
}
`

export default (services: any[]) => {
    return injectTemplate(template, {
        template: services.map((item) => injectTemplate(fnTemplate, item)).join("\n")
    })
}
