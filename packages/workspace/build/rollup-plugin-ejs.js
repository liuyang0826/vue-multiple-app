const {dataToEsm} = require("rollup-pluginutils")
const MagicString = require('magic-string')
const parser = require("@babel/parser")
const walk = require('estree-walk')
const art = require('art-template')

// 把ejs文件转成字符串即可
module.exports = () => {
  return {
    name: 'ejs',
    transform(code, tplFilePath) {
      if (/\.ejs$/.test(tplFilePath)) {
        const [, attrs, schemas] = code.match(/^(?:\r|\n|\s)*<script(?:\s*(.*)\s*)?>([\w\W]+)<\/script>(?:\r\n|\s)*$/) || []
        // 预编译schemas
        if (schemas) {
          const schemaStr = new MagicString(schemas)
          const ast = parser.parse(schemas, {
            sourceType: "module"
          })
          const importNameMap = {}
          let schemasStart = 0
          let schemasEnd = 0
          walk(ast, (node) => {
            if (node.type === "ExportDefaultDeclaration") {
              schemaStr.overwrite(node.start, node.declaration.start, "")
              schemasStart = node.declaration.start
              schemasEnd = node.declaration.end
            }
            if (node.type === "ImportDeclaration") {
              node.specifiers.forEach((node) => {
                const name = node.local.name
                importNameMap[name] = node.local
              })
            }
            if (node.type === "Identifier" && importNameMap[node.name] && importNameMap[node.name] !== node) {
              // 给import变量打标记
              schemaStr.overwrite(node.start, node.end, `<%- ${node.name} %>`)
            }
          })
          const importNameData = Object.keys(importNameMap).reduce((acc, cur) => {
            acc[cur] = `" + ${cur} + "`
            return acc
          }, {})
          if (/\.c.ejs$/.test(tplFilePath)) {
            // export default []
            schemaStr.overwrite(schemasStart, schemasEnd, art.render(dataToEsm(schemaStr.slice(schemasStart, schemasEnd)), importNameData));
          } else {
            // export default { schemas: [] }
            // 属性解析
            const attrStr = attrs?.split(/\s+/).reduce((acc, cur) => {
              const [key, value] = cur.split("=")
              return acc + key + ": " + (value?.slice(1, -1) || 'true') + ", "
            }, "") || ""
            schemaStr.overwrite(
              schemasStart,
              schemasEnd,
              art.render(dataToEsm("{" + attrStr + "schemas: " + schemaStr.slice(schemasStart, schemasEnd) + "}"), importNameData)
            )
          }
          return {
            code: schemaStr.toString(),
            map: {mappings: ''},
          }
        }
        return {
          code: dataToEsm(code),
          map: {mappings: ''},
        }
      }
    }
  }
}