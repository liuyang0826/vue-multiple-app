const { dataToEsm } = require("rollup-pluginutils")

// 把ejs文件转成字符串即可
module.exports = () => {
  return {
    name: 'ejs',
    transform(code, tplFilePath) {
      if (/\.ejs$/.test(tplFilePath)) {
        return {
          code: dataToEsm(code),
          map: {mappings: ''},
        };
      }
    },
  };
}