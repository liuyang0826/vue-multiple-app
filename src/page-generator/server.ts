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
            "templateId": "table",
            "name": "Test",
            "options": {
                "formItems": [
                    {
                        "type": "input",
                        "label": "用户名",
                        "prop": "name"
                    },
                    {
                        "type": "select",
                        "label": "性别",
                        "prop": "sex",
                        "source": "固定项",
                        "count": 2,
                        "options": [
                            {
                                "label": "男",
                                "value": "1"
                            },
                            {
                                "label": "女",
                                "value": "2"
                            }
                        ]
                    },
                    {
                        "type": "select",
                        "label": "尺寸",
                        "prop": "size",
                        "source": "接口",
                        "api": "/api/sizes",
                        "dep": "sex"
                    },
                    {
                        "type": "input",
                        "label": "年龄",
                        "prop": "age"
                    }
                ],
                "tableCols": [
                    {
                        "label": "用户名",
                        "prop": "name"
                    },
                    {
                        "label": "性别",
                        "prop": "sex"
                    },
                    {
                        "label": "年龄",
                        "prop": "age"
                    },
                    {
                        "label": "尺寸",
                        "prop": "size"
                    }
                ],
                "api": "/api/pageList",
                "hasPager": true,
                "addForm": {
                    "templateId": "dialog-form",
                    "name": "AddForm",
                    "options": {
                        "title": "新增用户",
                        "width": 440,
                        "formItems": [
                            {
                                "type": "input",
                                "label": "用户名",
                                "prop": "name"
                            },
                            {
                                "type": "select",
                                "label": "性别",
                                "prop": "sex",
                                "source": "固定项",
                                "count": 2,
                                "options": [
                                    {
                                        "label": "男",
                                        "value": "1"
                                    },
                                    {
                                        "label": "女",
                                        "value": "2"
                                    }
                                ]
                            },
                            {
                                "type": "select",
                                "label": "尺寸",
                                "prop": "size",
                                "source": "接口",
                                "api": "/api/sizes",
                                "dep": "sex"
                            },
                            {
                                "type": "input",
                                "label": "年龄",
                                "prop": "age"
                            }
                        ],
                        "api": "/api/addUser"
                    }
                },
                "updateForm": {
                    "templateId": "dialog-form",
                    "name": "UpdateForm",
                    "options": {
                        "title": "编辑用户",
                        "width": 440,
                        "formItems": [
                            {
                                "type": "input",
                                "label": "用户名",
                                "prop": "name"
                            },
                            {
                                "type": "select",
                                "label": "性别",
                                "prop": "sex",
                                "source": "固定项",
                                "count": 2,
                                "options": [
                                    {
                                        "label": "男",
                                        "value": "1"
                                    },
                                    {
                                        "label": "女",
                                        "value": "2"
                                    }
                                ]
                            },
                            {
                                "type": "input",
                                "label": "年龄",
                                "prop": "age"
                            },
                            {
                                "type": "select",
                                "label": "尺寸",
                                "prop": "szie",
                                "source": "接口",
                                "api": "/api/sizes",
                                "dep": "sex"
                            }
                        ],
                        "api": "/api/updateUser"
                    }
                },
                "deleteApi": "/api/delete",
                "batchDeleteApi": "/api/batchDelete",
                "toggleEnableApi": "/api/toggleEnable",
                "moveApi": "/api/move",
                "exportApi": "/api/export",
                "hasSelection": true
            },
            "components": []
        })
        ctx.body = "success"
    })

    app.use(router.routes());

    app.listen(9000, () => {
        console.log("ready on: http://localhost:9000");
    })
}

createServer()
