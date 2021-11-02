const { injectTemplate, componentNameToTagName, firstToLowerCase, firstToUpperCase } = require("./utils")

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
} from "./services<%fileName%>"`

const componentImportsTemplate = `import <%name%> from "./components/<%name%>"`

const componentsTemplate = `<<%component%><%props%>/>`

module.exports = (config, type) => {
    const { components } = config
    const { options, components: privateComponents, services } = require(`./${config.templateId}`).process(config)

    const mergedComponents = [...(privateComponents || []), ...(components || [])]

    const { template, utilImports, serviceImports, pipeMethods, name } = options

    const realUtilImports = new Set(utilImports)

    const injectParents = mergedComponents.map((item) => require(`./${item.templateId}`).injectParent(item.parentOptions))

    injectParents?.forEach(({ utilImports: injectUtilImports, pipeMethods: injectPipeMethods }) => {
        injectUtilImports.forEach((item) => {
            realUtilImports.add(item)
        })
        injectPipeMethods.forEach((item) => {
            pipeMethods.push(item)
        })
    })

    const componentNames = [...new Set(mergedComponents.map(d => d.name))]
    if (mergedComponents.length) {
        realUtilImports.add("injectComponents")
        pipeMethods.push(`injectComponents({ ${componentNames.join(", ")} })`)
    }

    return {
        template: injectTemplate(injectTemplate(baseTemplate, {
            template,
            name: firstToUpperCase(name),
            utilImports: realUtilImports.size ? injectTemplate(utilImportsTemplate, {
                imports: [...realUtilImports].join(",\n  ")
            }) : " ",
            componentImports: componentNames.map(name => injectTemplate(componentImportsTemplate, { name })).join("\n") || " ",
            serviceImports: serviceImports?.length ? injectTemplate(serviceImportsTemplate, {
                imports: serviceImports.join(",\n  "),
                fileName: type === "page" ? "" : `/${firstToLowerCase(name)}`,
            }) : " ",
            pipeMethods: pipeMethods?.join(",\n  ") || " ",
        }), {
            components: mergedComponents.map((item, index) => {
                const props = injectParents[index].props || []
                return injectTemplate(componentsTemplate, {
                    component: componentNameToTagName(item.name),
                    props: props.length ?` ${injectParents[index].props?.join(" ")} ` : " "
                }, 4)
            }) .join("\n    ")|| " "
        }),
        components: mergedComponents,
        services
    }
}