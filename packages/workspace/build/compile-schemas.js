const babelParser = require("@babel/parser")
const t = require("@babel/types")
const traverse = require("@babel/traverse");
const generate = require("@babel/generator")

// 查找当前变量的引用作用域
function findRefScope(path) {
  const name = path.node.name
  let curScope = path.scope
  while (curScope) {
    if (curScope.hasOwnBinding(name)) {
      return curScope
    }
    curScope = curScope.parent
  }
  return null
}

/**
 * 目前仅支持简单的import和函数传参，不支持逻辑判断
 **/
function compileSchemas(code) {
  const ast = babelParser.parse(code, {
    sourceType: "module"
  })
  const returnList = []
  let prevStart = 0
  let replaceNode
  let replacePath
  let exportNode
  traverse.default(ast, {
    enter(path) {
      if (t.isExportDefaultDeclaration(path.node)) {
        exportNode = path.node.declaration
      }
      if (exportNode && !replaceNode) {
        if (t.isExportDefaultDeclaration(path.parent)) {
          replaceNode = path.node
          if (t.isArrowFunctionExpression(path.node)) {
            replaceNode = replaceNode.body
          }
        } else if (t.isReturnStatement(path.node)) {
          const refScope = findRefScope(path)
          if ((!refScope || refScope.block === exportNode || t.isProgram(refScope.path.node))) {
            replaceNode = path.node.argument
          }
        }
      }
      if (!replacePath && path.node === replaceNode) {
        replacePath = path
        prevStart = replaceNode.start
      }
      if (replacePath && t.isIdentifier(path.node)) {
        const refScope = findRefScope(path)
        if (
          (!refScope || refScope.block === exportNode || t.isProgram(refScope.path.node))
          && (
            (t.isObjectProperty(path.parent) && path.parent.value === path.node) // 对象值
            || t.isArrayExpression(path.parent) // 数组元素
            || t.isReturnStatement(path.parent) // 直接return
            || t.isSpreadElement(path.parent) // ... 结构运算符
            || t.isCallExpression(path.parent) // 函数调用
            || t.isBinaryExpression(path.parent) // 字符串表达式
            || t.isTemplateLiteral(path.parent) // 模板字符串
          )
        ) {
          const { start, end, name } = path.node
          if (start > prevStart) {
            returnList.push(t.stringLiteral(code.slice(prevStart, start)))
            if (path.parent.shorthand) {
              returnList.push(t.stringLiteral(`${name}: `))
            }
            // 函数调用保留原表达式
            if (t.isCallExpression(path.parent)) {
              returnList.push(path.parent)
              prevStart = path.parent.end
            } else {
              returnList.push(t.identifier(code.slice(start, end)))
              prevStart = end
            }
          }
        }
      }
    }
  });
  returnList.push(t.stringLiteral(code.slice(prevStart, replaceNode.end)))
  replacePath.replaceWith(
    returnList.reduce(
      (acc, cur) => (binaryExpression) => acc(
        t.binaryExpression("+", cur, binaryExpression)
      ), binaryExpression => t.binaryExpression("+", t.stringLiteral(""), binaryExpression)
    )(t.stringLiteral(""))
  )
  return generate.default(ast, {}).code
}

module.exports = compileSchemas