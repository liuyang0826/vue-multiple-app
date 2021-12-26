const schemasMap = new Map()

export async function resolveSchemas(id) {
    return await (schemasMap.get(id) || schemasMap.set(id, new Promise(resolve => {
        const script = document.createElement("script")
        const cb = `schema_jsonp_${id}`
        script.src = `http://127.0.0.1:5000/getSchemaById?cb=${cb}&id=${id}`
        window[cb] = function (schemas) {
            schemasMap.set(id, schemas)
            resolve(schemas)
            delete window[cb]
            document.head.removeChild(script)
        }
        document.head.appendChild(script)
    })).get(id))
}

export function getPropByPath(data, paths = []) {
    let result = data
    for (let i = 0; i < paths.length; i++) {
        result = result[paths[i]]
    }
    return result
}