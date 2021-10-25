const fs = require("fs")
const path = require("path")

const devMultipleDir = path.join(process.cwd(), "node_modules", ".multiple-app")
const devAssetsPath = path.join(devMultipleDir, "assets.json")
const isDEV = process.env.NODE_ENV === "development"

class DumpAssetsPlugin {
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

            const filename = isDEV ? devAssetsPath : path.join(stats.outputPath, "assets.json")

            fs.writeFileSync(filename, JSON.stringify(assets));
        });
    }
}

const before = (app) => {
    app.all("*", (req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "*");
        next();
    })
    app.get('/assets.json', function (req, res) {
        res.setHeader("Content-Type", "application/json; charset=utf-8")
        res.send(fs.readFileSync(devAssetsPath, "utf-8"));
    });
}

const chainWebpack = (config, { appName }) => {
    config.output
        .libraryTarget("umd")
        .library(appName);

    config.plugin("DumpAssetsPlugin")
        .use(DumpAssetsPlugin)
}

function withMultipleApp(options) {
    const { appName, port, prodPublicPath } = options
    return (vueConfig = {}) => {
        vueConfig.publicPath = isDEV ? `http://127.0.0.1:${port}/` : prodPublicPath

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

        const configChainWebpack = vueConfig.chainWebpack
        vueConfig.chainWebpack = (config) => {
            if (configChainWebpack) configChainWebpack(config)
            chainWebpack(config, { appName })
        }

        return vueConfig
    }
}

module.exports = withMultipleApp({
    appName: "app_user",
    port: 8082
})()