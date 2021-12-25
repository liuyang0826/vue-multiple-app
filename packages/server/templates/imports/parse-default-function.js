const parser = require("@babel/parser")
const walk = require('estree-walk')
const MagicString = require('magic-string')

function parseDefaultFunction(code, name) {
    const s = new MagicString(code)

    const ast = parser.parse(code, {
        sourceType: "module"
    })
    walk(ast, function (node) {
        if (node.type === "ExportDefaultDeclaration") {
            if (node.start !== 0) {
                s.overwrite(0, node.start, "")
            }
            s.overwrite(node.start, node.declaration.start, "")
        }
        if (node.type === "FunctionDeclaration") {
            if (node.id) {
                s.overwrite(node.id.start, node.id.end, name)
            } else {
                s.appendRight(node.start + "function".length, ` ${name}`)
            }
        }
        if (node.type === "ArrowFunctionExpression") {
            s.appendLeft(node.start, `const ${name} = `)
        }
    })

    return s.toString()
}

module.exports = parseDefaultFunction