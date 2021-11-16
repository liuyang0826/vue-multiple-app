import {IComponentConfig, IComponentTypeEnum} from "./@types";
import {getTemplateById} from "./scanner";

import { injectTemplate, camelCaseToShortLine, firstToUpperCase } from "./utils"

const baseTemplate =
`<template>
  <%template%>
</template>

<script>
import pipe from "@cisdiliuyang/hooks/pipe";
<%utilImports%>
<%componentImports%>
<%serviceImports%>

export default pipe(
  <%hooks%>
)({
  name: "<%name%>",
})
</script>

<style lang="scss" scoped></style>
`

const utilImportsTemplate =
`import {
  <%imports%>
} from "@cisdiliuyang/hooks"`

const serviceImportsTemplate =
`import {
  <%imports%>
} from "<%servicePath%>"`

const componentImportsTemplate = `import <%name%> from "<%componentPath%><%name%>"`

const componentsTemplate = `<<%component%><%props%>/>`

interface IInjectComponentParams {
    name: string
    props: string[]
}

export const makeComponentCode = ({ name, props}: IInjectComponentParams, indent = 4 ) => {
  return injectTemplate(componentsTemplate, {
      component: camelCaseToShortLine(name),
      props: props.length ?` ${props?.join(" ")} ` : " "
  }, indent)
}

const vueTemplate =  (config: IComponentConfig, type: IComponentTypeEnum) => {
    const { components } = config
    const {
        name,
        template,
        hooks = [],
        components: privateComponents,
        services
    } = getTemplateById(config.templateId)!.processTemplate(config, type)

    const realName = firstToUpperCase(name)

    const mergedComponents = [...(privateComponents || []), ...(components || [])]

    const injectParents = components?.map((item) => getTemplateById(item.templateId)!.injectParent(item))

    injectParents?.forEach(({ hooks: injectHooks }) => {
        injectHooks.forEach(item => {
            hooks.push(item)
        })
    })

    const componentNames = Array.from(new Set(mergedComponents.map(d => d.name)))
    if (componentNames.length) {
        hooks.unshift(`useComponents({
    ${componentNames.join(",\n    ")}
  })`)
    }

    const utilImports = new Set(hooks?.map((d: string) => d.match(/\w+/)![0]) || [])

    return {
        template: injectTemplate(injectTemplate(baseTemplate, {
            template,
            name: realName,
            utilImports: utilImports.size ? injectTemplate(utilImportsTemplate, {
                imports: Array.from(utilImports).join(",\n  ")
            }) : " ",
            componentImports: componentNames.map(name => injectTemplate(componentImportsTemplate, {
                name,
                componentPath: type === IComponentTypeEnum.page ? "./components/" : "./"
            })).join("\n") || " ",
            serviceImports: services?.length ? injectTemplate(serviceImportsTemplate, {
                imports: services.map((d: any) => d.name).join(",\n  "),
                servicePath: type === IComponentTypeEnum.page ? "./services" : `../services/${camelCaseToShortLine(realName)}`,
            }) : " ",
            hooks: hooks?.join(",\n  ") || " ",
        }), {
            // 模板私有的组件需要自己处理注入到template的逻辑，公共处理逻辑只处理拓展组件
            components: components?.map((item, index) => {
                return makeComponentCode({
                    name: item.name,
                    props: injectParents![index].props || []
                })
            }) .join("\n    ")|| " "
        }),
        components: mergedComponents,
        services
    }
}

export default vueTemplate
