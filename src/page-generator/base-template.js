const { injectTemplate, firstToLowerCase, firstToUpperCase } = require("./utils")

const baseTemplate =
`<template>
  <%template%>
</template>

<script>
import pipe from "../../utils/pipe";
<%utilImports%>
<%componentImports%>
<%serviceImports%>

export default pipe(
  <%pipeMethods%>
)({
  name: "<%name%>",
})
</script>

<style lang="scss" scoped></style>
`

const utilImportsTemplate =
`import {
  <%imports%>
} from "../../utils"`

const serviceImportsTemplate =
`import {
  <%imports%>
} from "./services/<%fileName%>"`

const componentImportsTemplate =
`import <%name%> from "./components/<%name%>"`

module.exports = ({ template, utilImports, componentImports, serviceImports, pipeMethods, name }) => {
    return injectTemplate(baseTemplate, {
        template,
        name: firstToUpperCase(name),
        utilImports: utilImports?.length ? injectTemplate(utilImportsTemplate, {
            imports: utilImports.join(",\n  ")
        }) : " ",
        componentImports: componentImports?.map(name => injectTemplate(componentImportsTemplate, { name })).join("\n") || " ",
        serviceImports: serviceImports?.length ? injectTemplate(serviceImportsTemplate, {
            imports: serviceImports.join(",\n  "),
            fileName: firstToLowerCase(name),
        }) : " ",
        pipeMethods: pipeMethods?.join(",\n  ") || " ",
    })
}