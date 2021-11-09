import Koa from "koa"
import KoaRouter from "koa-router"
import writeFile from "./write-file"
import fs from "fs"
import path from "path"

const createServer = () => {
    const app = new Koa()
    const router = new KoaRouter();

    app.use(async (ctx, next) => {
        ctx.res.setHeader("Access-Control-Allow-Origin", "*")
        ctx.res.setHeader("Access-Control-Allow-Methods", "*")
        await next()
    })

    router.post("/api/pageList", async (ctx) => {
      ctx.body = {
          total: 2,
          list: [
              { name: "张三", sex: 1 },
              { name: "李四", sex: 2 },
          ]
      }
    })

    router.get("/templates", async (ctx) => {
        const templateDirs = fs.readdirSync(path.join(__dirname, "templates"))
        ctx.body = templateDirs.map((templateDir) => {
            return {
                ...require(path.join(__dirname, "templates", templateDir)).description,
                id: templateDir
            }
        })
    })

    router.get("/getTemplateFormById", async (ctx) => {
        ctx.body = require(`./templates/${ctx.query.id}`).description
    })

    router.post("/submit", async (ctx) => {
        ctx.body = "success"
    })

    router.get("/", async (ctx) => {
        writeFile({
            "templateId": "tabs",
            "name": "Test",
            "options": {
                "tabPanes": [
                    {
                        "name": "user",
                        "label": "用户信息",
                        "component": {
                            "templateId": "table",
                            "name": "UserTable",
                            "options": {
                                "tableCols": [
                                    {
                                        "label": "用户名",
                                        "prop": "name"
                                    }
                                ],
                                "hasPagination": true
                            },
                            "components": []
                        }
                    },
                    {
                        "name": "car",
                        "label": "车辆信息",
                        "component": {
                            "templateId": "table",
                            "name": "CarTable",
                            "options": {
                                "tableCols": [
                                    {
                                        "label": "名称",
                                        "prop": "name"
                                    }
                                ],
                                "hasPagination": true
                            },
                            "components": []
                        }
                    }
                ]
            }
        })
        ctx.body = "success"
    })

    app.use(router.routes());

    app.listen(9000, () => {
        console.log("ready on: http://localhost:9000");
    })
}

createServer()
