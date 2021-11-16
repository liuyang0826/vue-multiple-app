module.exports = {
    devServer: {
        before(app) {
            app.get("/multiple.config", (req, res) => {
              res.json([
                  {
                      name: "app_user",
                      path: "/user/*",
                      entry: "http://127.0.0.1:8082",
                  },
                  {
                      name: "app_device",
                      path: "/device/*",
                      entry: "http://127.0.0.1:8081",
                  },
              ])
            })
        }
    },
    transpileDependencies: [/(node_modules\/)?@cisdiliuyang\/.*/]
}