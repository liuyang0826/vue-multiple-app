const t = require("@babel/types")
const generate = require("@babel/generator")

const walkMatch = (input, re, walker) => {
  let match
  let remaining = input
  while ((match = re.exec(remaining))) {
    walker(match)
    remaining = remaining.slice(match.index + match[0].length)
  }
}

// 编译 <% include("./header.ejs", "data") %> 支持子模板
function compileTemplate(code) {
  const body = []
  const exportNodeList = []

  let prevStart = 0
  walkMatch(code, /<%\s*include\((['"])(.+)\1,\s*(['"])(.+)\3\s*\)\s*%>/, (match) => {
    const [str, , source, , name] = match
    body.push(
      t.importDeclaration([t.importDefaultSpecifier(t.identifier(name))], t.stringLiteral(source))
    )
    exportNodeList.push(t.stringLiteral(code.slice(prevStart, match.index)))
    exportNodeList.push(t.identifier(name))
    prevStart = match.index + str.length
  });
  exportNodeList.push(t.stringLiteral(code.slice(prevStart)))

  body.push(t.exportDefaultDeclaration(
    exportNodeList.reduce(
      (acc, cur) => (binaryExpression) => acc(
        t.binaryExpression("+", cur, binaryExpression)
      ), binaryExpression => t.binaryExpression("+", t.stringLiteral(""), binaryExpression)
    )(t.stringLiteral(""))
  ))

  return generate.default(t.file(t.program(body)), {}).code
}

module.exports = compileTemplate