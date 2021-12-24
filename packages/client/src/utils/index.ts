export function mapFormItems(context: IContext) {
    const formItems: IFormItem = []
    function process(context: IContext) {
        const { schemas, model, path } = context
        schemas?.forEach((schema) => {
            formItems.push(schema)
            schema.context = context
            if (!(schema.prop in model)) {
                model[schema.prop] = schema.default
                if (["checkboxGroup", "list"].includes(schema.type) && !model[schema.prop]) {
                    model[schema.prop] = []
                }
            }
            const effect = schema.effect?.({ model, schemas })
            if (!effect) {
                return
            }
            if (Array.isArray(effect)) {
                process({...context, schemas: effect, path: [...path]})
            } else {
                if (!model[effect.prop]) {
                    model[effect.prop] = {}
                }
                process({...context, schemas: effect.schemas, model: model[effect.prop], path: [...path, effect.prop]})
            }
        })
    }
    process(context)
    context.formItems = formItems
}

export function add(item: IFormItem) {
    const { prop, schemas, context } = item
    const newModel = {}
    schemas.forEach((schema) => {
        if (["more", "list"].includes(schema.type)) {
            const newContext = {
                formItems: [],
                schemas: schema.schemas,
                model: newModel,
                path: [...context.path, prop, context.model[prop].length]
            }
            schema.context = newContext
            mapFormItems(newContext)
        } else {
            newModel[schema.prop] = schema.default
        }
    })
    context.model[prop].push(newModel)
}