const babelParser = require("@babel/parser")
const t = require("@babel/types")
const traverse = require("@babel/traverse");
const generate = require("@babel/generator")
const MagicString = require('magic-string')

function compileSchemas(code) {
  const ast = babelParser.parse(code, {
    sourceType: "module"
  })
  const s = new MagicString(code)
  let prevStart = 0
  let end = 0
  let returnList = []
  let replaceNode
  let exportNode
  traverse.default(ast, {
    enter(path) {
      if (replaceNode && t.isIdentifier(path.node)) {
        if (
          (path.scope.block === exportNode || t.isProgram(path.scope.block)) // 通过作用域锁定范围
          && (
            (t.isObjectProperty(path.parent) && path.parent.value === path.node) // 对象值
            || t.isArrayExpression(path.parent) // 数组元素
            || t.isReturnStatement(path.parent) // 直接return
            || t.isSpreadElement(path.parent) // ...
            || t.isCallExpression(path.parent) // 函数调用
          )
        ) {
          const { start, end, name } = path.node
          if (start > prevStart) {
            returnList.push({ type: "string", content: s.slice(prevStart, start)})
            if (path.parent.shorthand) {
              returnList.push({ type: "string", content: `${name}: `})
            }
            returnList.push({ type: "var", content: s.slice(start, end) })
            prevStart = end
          }
        }
      }
      if (t.isExportDefaultDeclaration(path.node)) {
        exportNode = path.node.declaration
      }
      if (exportNode && !replaceNode) {
        if (t.isExportDefaultDeclaration(path.parent)) {
          if (t.isArrowFunctionExpression(path.node)) {
            replaceNode = path.node.body
            prevStart = path.node.body.start
            end = path.node.body.end
          } else {
            replaceNode = path.node
            prevStart = path.node.start
            end = path.node.end
          }
        } else if (t.isReturnStatement(path.node) && (path.scope.block === exportNode || t.isProgram(path.scope.block))) {
          replaceNode = path.node.argument
          prevStart = path.node.start + "return ".length
          end = path.node.end
        }
      }
    }
  });
  returnList.push({
    type: "string",
    content: s.slice(prevStart, end)
  })
  traverse.default(ast, {
    enter(path) {
      if (path.node === replaceNode) {
        path.replaceWith(
          returnList.reduce((acc, cur) => {
            return (binaryExpression) => acc(t.binaryExpression("+", cur.type === "string" ? t.stringLiteral(cur.content) : t.identifier(cur.content), binaryExpression))
          }, (binaryExpression) => t.binaryExpression("+", t.stringLiteral(""), binaryExpression))(t.stringLiteral(""))
        )
      }
    }
  })
  return generate.default(ast, {}).code
}

module.exports = compileSchemas