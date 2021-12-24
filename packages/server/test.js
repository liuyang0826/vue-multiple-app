const parser = require("@babel/parser")
const walk = require('estree-walk')
const MagicString = require('magic-string')

const code = "export default function(form) {\n  return {\n    name: form.name\n  }\n}"

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
            s.overwrite(node.id.start, node.id.end, "curName")
        } else {
            s.appendRight(node.start + "function".length, " curName")
        }
    }
    if (node.type === "ArrowFunctionExpression") {
        s.appendLeft(node.start, "const curName = ")
    }
})

console.log(s.toString());