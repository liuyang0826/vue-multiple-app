const {dataToEsm} = require("rollup-pluginutils")
const compileSchemas = require("./compile-schemas")

// 把ejs文件转成字符串即可
module.exports = () => {
  return {
    name: 'ejs',
    transform(code, tplFilePath) {
      if (/\.ejs$/.test(tplFilePath)) {
        const [, attrs, schemas] = code.match(/^(?:\r|\n|\s)*<script(?:\s*(.*)\s*)?>([\w\W]+)<\/script>(?:\r\n|\s)*$/) || []
        // 预编译schemas
        if (schemas) {
          return {
            code: compileSchemas(schemas),
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