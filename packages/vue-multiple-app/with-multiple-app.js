const fs = require("fs")
const path = require("path")
const postcss = require('postcss');

const devMultipleDir = path.join(process.cwd(), "node_modules", ".vue-multiple-app")
const devAssetsPath = path.join(devMultipleDir, "assets.js")
const isDEV = process.env.NODE_ENV === "development"

class DumpAssetsPlugin {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        compiler.hooks.afterEmit.tap("ExportAssets", (compilation) => {
            const stats = compilation.getStats().toJson();

            const entryPoints = compilation.entrypoints;
            const entryNames = Array.from(entryPoints.keys());

            const files = new Set()

            entryNames.forEach((entryName) => {
                const entryFiles = entryPoints.get(entryName).getFiles();
                entryFiles.forEach((entryFile) => {
                    files.add(entryFile)
                })
            })

            const assets = {
                js: [],
                css: [],
                uncase: []
            };

            [...files].forEach(f => {
                const sp = f.split('.')
                const ext = sp[sp.length - 1]
                if (assets[ext]) {
                    assets[ext].push(f)
                } else {
                    assets.uncase.push(f)
                }
            })

            if (isDEV && !fs.existsSync(devMultipleDir)) {
                fs.mkdirSync(devMultipleDir)
            }

            const filename = isDEV ? devAssetsPath : path.join(stats.outputPath, "assets.js")

            fs.writeFileSync(filename, `window["${this.options.name}"]=${JSON.stringify(assets)}`);
        });
    }
}

const before = (app) => {
    app.all("*", (req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "*");
        next();
    })
    app.get('/assets.js', function (req, res) {
        res.send(fs.readFileSync(devAssetsPath, "utf-8"));
    });
}

const chainWebpack = (config, { name }) => {
    config.output
    .libraryTarget("umd")
    .library(name);

    config.plugin("DumpAssetsPlugin")
    .use(DumpAssetsPlugin, [{ name }])
}

const globalNamespacePlugin = postcss.plugin('postcss-global-namespace', (options) => {
    const { name } = options
    return root => {
        root.walk(node => {
            // @keyframes fn 动画函数不修改
            if (node.parent.type === "atrule" && node.parent.name === "keyframes") {
                return
            }
            node.selector = (((node.selector || '').split(',') || []).map((item) => {
                return item.match(/^(\s*)(html|body)(\s*)$/) ? item : name + ' ' + item.trim()
            }).join(','))
        })
    };
})

function withMultipleApp(options) {
    const { name, port, prodPublicPath } = options
    return (vueConfig = {}) => {
        vueConfig.publicPath = isDEV ? `http://127.0.0.1:${port}/` : prodPublicPath

        // 配置dev环境代理
        const configBefore = vueConfig.devServer?.before
        vueConfig.devServer = {
            ...vueConfig.devServer,
            open: false,
            port,
            before(app, server) {
                before(app)
                if (configBefore) configBefore(app, server)
            }
        }

        // 修改打包配置
        const configChainWebpack = vueConfig.chainWebpack
        vueConfig.chainWebpack = (config) => {
            if (configChainWebpack) configChainWebpack(config)
            chainWebpack(config, { name })
        }

        vueConfig.transpileDependencies = [...(vueConfig.transpileDependencies || []), /node_modules\/@cisdiliuyang\/.*/]

        // 添加css命名空间
        vueConfig.css = {
            ...vueConfig.css,
            loaderOptions: {
                ...vueConfig.css?.loaderOptions,
                postcss: {
                    ...vueConfig.css?.loaderOptions?.postcss,
                    plugins: [...(vueConfig.css?.loaderOptions?.postcss?.plugins || []), globalNamespacePlugin({
                        name: `.${name}`
                    })]
                }
            }
        }
        return vueConfig
    }
}

module.exports = withMultipleApp
