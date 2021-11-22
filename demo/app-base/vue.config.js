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
            app.post("/api/pageList", (req, res) => {
                res.json({
                    status: true,
                    data: {
                        list: [
                            {id: 1, name: "张三", sex: 1, entry: "http://127.0.0.1:8082",},
                            {id: 2, name: "李四", sex: 2, entry: "http://127.0.0.1:8081",},
                        ],
                        total: 20
                    }
                })
            })
        }
    },
    transpileDependencies: [/node_modules\/@cisdiliuyang\/.*/]
}