const { injectTemplate, componentNameToTagName, firstToUpperCase } = require("./utils")

const vueTemplate =
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
} from "<%servicePath%>"`

const componentImportsTemplate = `import <%name%> from "./components/<%name%>"`

const componentsTemplate = `<<%component%><%props%>/>`

module.exports = (config, type) => {
    const { components } = config
    const { options, components: privateComponents, services } = require(`./${config.templateId}`).process(config)

    const mergedComponents = [...(privateComponents || []), ...(components || [])]

    const { name, template, pipeMethods } = options

    const injectParents = mergedComponents.map((item) => require(`./${item.templateId}`).injectParent(item.parentOptions))

    injectParents?.forEach(({ pipeMethods: injectPipeMethods }) => {
        injectPipeMethods.forEach((item) => {
            pipeMethods.push(item)
        })
    })

    const utilImports = new Set(pipeMethods.map(d => d.match(/\w+/)[0]))

    const componentNames = [...new Set(mergedComponents.map(d => d.name))]
    if (mergedComponents.length) {
        utilImports.add("injectComponents")
        pipeMethods.push(`injectComponents({ ${componentNames.join(", ")} })`)
    }

    return {
        template: injectTemplate(injectTemplate(vueTemplate, {
            template,
            name: firstToUpperCase(name),
            utilImports: utilImports.size ? injectTemplate(utilImportsTemplate, {
                imports: [...utilImports].join(",\n  ")
            }) : " ",
            componentImports: componentNames.map(name => injectTemplate(componentImportsTemplate, { name })).join("\n") || " ",
            serviceImports: services?.length ? injectTemplate(serviceImportsTemplate, {
                imports: services.map(d => d.name).join(",\n  "),
                servicePath: type === "page" ? "./services" : `../services`,
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
