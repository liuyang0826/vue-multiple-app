module.exports = {
    publicPath: "http://localhost:8081/",
    configureWebpack: {
        output: {
            filename: "app.js",
            libraryTarget: "umd",
            library: "appDevice"
        }
    },
    devServer: {
        open: false,
        port: 8081,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        }
    }
}