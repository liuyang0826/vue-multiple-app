const path = require('path');
const fs = require('fs-extra');
const rollup = require('rollup');
const glob = require('glob');
const ejs = require('./rollup-ejs-plugin');

async function build(name) {
  const bundle = await rollup.rollup({
    input: path.resolve(`src/${name}/index.js`),
    plugins: [
      ejs()
    ]
  });
  await bundle.write({
    file: path.resolve(`dist/${name}.js`),
    format: 'commonjs',
    exports: "default"
  });
}

async function buildAll() {
  const files = glob.sync('src/**/index.js')
  await Promise.all(files.map((file) => build(file.match(/src\/(.+)\/index.js/)[1])))
  uploader()
}

function uploader() {
  fs.moveSync(path.resolve("dist"), path.resolve("../server/cloud-functions"), { overwrite: true })
}

buildAll();