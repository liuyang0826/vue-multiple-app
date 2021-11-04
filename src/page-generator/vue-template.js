const { injectTemplate, camelCaseToShortLine, firstToUpperCase } = require("./utils")

const vueTemplate =
`<template>
  <%template%>
</template>

<script>
import pipe from "@/utils/pipe";
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
} from "@/utils"`

const serviceImportsTemplate =
`import {
  <%imports%>
} from "<%servicePath%>"`

const componentImportsTemplate = `import <%name%> from "<%componentPath%><%name%>"`

const componentsTemplate = `<<%component%><%props%>/>`

module.exports = (config, type) => {
    const { components } = config
    const { options, components: privateComponents, services } = require(`./templates/${config.templateId}`).process(config)

    const { name, template, pipeMethods } = options

    const realName = firstToUpperCase(name)

    const mergedComponents = [...(privateComponents || []), ...(components || [])]
    if (type !== "page") {
        // 给组件内的组件添加命名空间
        mergedComponents.forEach((item) => {
            item.name = `${realName}${firstToUpperCase(item.name)}`
        })
    }

    const injectParents = mergedComponents.map((item) => require(`./templates/${item.templateId}`).injectParent(item.parentOptions))

    injectParents?.forEach(({ pipeMethods: injectPipeMethods }) => {
        injectPipeMethods.forEach((item) => {
            pipeMethods.push(item)
        })
    })

    const componentNames = [...new Set(mergedComponents.map(d => d.name))]
    if (mergedComponents.length) {
        pipeMethods.unshift(`injectComponents({
    ${componentNames.join(",\n    ")}
  })`)
    }

    const utilImports = new Set(pipeMethods.map(d => d.match(/\w+/)[0]))

    return {
        template: injectTemplate(injectTemplate(vueTemplate, {
            template,
            name: realName,
            utilImports: utilImports.size ? injectTemplate(utilImportsTemplate, {
                imports: [...utilImports].join(",\n  ")
            }) : " ",
            componentImports: componentNames.map(name => injectTemplate(componentImportsTemplate, {
                name,
                componentPath: type === "page" ? "./components/" : "./"
            })).join("\n") || " ",
            serviceImports: services?.length ? injectTemplate(serviceImportsTemplate, {
                imports: services.map(d => d.name).join(",\n  "),
                servicePath: type === "page" ? "./services" : `../services/${camelCaseToShortLine(realName)}`,
            }) : " ",
            pipeMethods: pipeMethods?.join(",\n  ") || " ",
        }), {
            components: mergedComponents.map((item, index) => {
                const props = injectParents[index].props || []
                return injectTemplate(componentsTemplate, {
                    component: camelCaseToShortLine(item.name),
                    props: props.length ?` ${injectParents[index].props?.join(" ")} ` : " "
                }, 4)
            }) .join("\n    ")|| " "
        }),
        components: mergedComponents,
        services
    }
}
