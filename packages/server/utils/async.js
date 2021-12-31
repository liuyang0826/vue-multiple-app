const fs = require("fs")
const glob = require("glob")

function writeFileAsync(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      err ? reject(err) : resolve()
    })
  })
}

function mkdirAsync(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      err ? reject(err) : resolve()
    })
  })
}

function globAsync(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

module.exports = {
  writeFileAsync,
  mkdirAsync,
  globAsync
}