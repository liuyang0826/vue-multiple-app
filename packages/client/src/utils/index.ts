export async function resolveSchemas(id) {
    return new Promise(resolve => {
        const script = document.createElement("script")
        const cb = `schema_jsonp_${id}`
        script.src = `http://127.0.0.1:5000/getSchemaById?cb=${cb}&id=${id}`
        window[cb] = function (schemas) {
            delete window[cb]
            resolve(schemas)
        }
        document.head.appendChild(script)
    })
}

export async function mapFormItems(context: IContext) {
    const formItems: IFormItem = []
    async function process(context: IContext) {
        const { schemas, model, path } = context
        for (let i = 0; i < schemas.length; i++) {
            const schema = schemas[i]
            formItems.push(schema)
            schema.context = context
            if (!(schema.prop in model)) {
                model[schema.prop] = schema.default
                if (["checkboxGroup", "list"].includes(schema.type) && !model[schema.prop]) {
                    model[schema.prop] = []
                }
            }
            const effect = await schema.effect?.({ model, schemas, resolveSchemas })
            if (!effect) {
                continue
            }
            if (Array.isArray(effect)) {
                await process({...context, schemas: effect, path: [...path]})
            } else {
                if (!model[effect.prop]) {
                    model[effect.prop] = {}
                }
                await process({...context, schemas: effect.schemas, model: model[effect.prop], path: [...path, effect.prop]})
            }
        }
    }
    await process(context)
    context.formItems = formItems
}

export async function add(item: IFormItem) {
    const { prop, schemas, context } = item
    const newModel = {}
    for (let i = 0; i < schemas.length; i++) {
        const schema = schemas[i]
        if (["more", "list"].includes(schema.type)) {
            const newContext = {
                formItems: [],
                schemas: schema.schemas,
                model: newModel,
                path: [...context.path, prop, context.model[prop].length]
            }
            schema.context = newContext
            await mapFormItems(newContext)
        } else {
            newModel[schema.prop] = schema.default
        }
    }
    context.model[prop].push(newModel)
}