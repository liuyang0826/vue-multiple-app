const {dataToEsm} = require("rollup-pluginutils")
const MagicString = require('magic-string')

// 把ejs文件转成字符串即可
module.exports = () => {
  return {
    name: 'ejs',
    transform(code, tplFilePath) {
      if (/\.ejs$/.test(tplFilePath)) {
        const [, attrs, schemas] = code.match(/^(?:\r|\n|\s)*<script(?:\s*(.*)\s*)?>([\w\W]+)<\/script>(?:\r\n|\s)*$/) || []
        // 预编译schema
        if (schemas) {
          const s = new MagicString("{}")
          s.appendRight(1, attrs.split(/\s+/).join(",").replace(/=/g, ":"))
          s.appendRight(1, ",schemas:")
          s.appendRight(1, schemas)
          return {
            code: dataToEsm(s.toString()),
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