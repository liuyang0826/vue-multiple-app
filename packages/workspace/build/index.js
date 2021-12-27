const path = require('path');
const fs = require('fs-extra');
const rollup = require('rollup');
const glob = require('glob');
const ejs = require('./rollup-plugin-ejs');
const { terser } = require('rollup-plugin-terser');

async function index(name) {
  const bundle = await rollup.rollup({
    input: path.resolve(`src/${name}/index.js`),
    plugins: [
      ejs(),
      terser(),
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
  await Promise.all(files.map((file) => index(file.match(/src\/(.+)\/index.js/)[1])))
  uploader()
}

function uploader() {
  fs.moveSync(path.resolve("dist"), path.resolve("../server/workspace"), { overwrite: true })
}

buildAll();