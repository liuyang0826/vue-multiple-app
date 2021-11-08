import Koa from "koa"
import KoaRouter from "koa-router"
import writeFile from "./write-file"
import fs from "fs"
import path from "path"
import { description } from "./templates/dialog-form";
import { ITemplateDesc } from "./@types";

const createServer = () => {
    const app = new Koa()
    const router = new KoaRouter();

    app.use(async (ctx, next) => {
        ctx.res.setHeader("Access-Control-Allow-Origin", "*")
        ctx.res.setHeader("Access-Control-Allow-Methods", "*")
        await next()
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
            templateId: "normal-table",
            name: "Test",
            options: {
                formItems: [
                    { type: "input", label: "用户名", prop: "username", maxlength: 100 },
                    { type: "input", label: "密码", prop: "password", maxlength: 100 },
                    { type: "input", label: "年龄", prop: "age", maxlength: 2 },
                    {
                        type: "select",
                        label: "性别",
                        prop: "sex",
                        options: [
                            { value: "1", label: "男" },
                            { value: "2", label: "女" },
                        ],
                        id: "sex"
                    },
                    {
                        type: "select",
                        label: "班级", prop: "class", maxlength: 100,
                        api: "/api/select/getSelectOptions",
                        dep: "sex"
                    },
                ],
                tableCols: [
                    { label: "用户名", prop: "username" },
                    { label: "密码", prop: "password" },
                    { label: "年龄", prop: "age" },
                    { label: "班级", prop: "class" },
                    { label: "备注", prop: "remarks" },
                    { label: "备注", prop: "remarks" },
                    { label: "备注", prop: "remarks" },
                ],
                hasPagination: true,
                addForm: {
                    templateId: "dialog-form",
                    name: "AddForm",
                    options: {
                        title: "新增用户",
                        formItems: [
                            { type: "input", label: "用户名", prop: "username", maxlength: 100 },
                            { type: "input", label: "密码", prop: "password", maxlength: 100 },
                            { type: "input", label: "年龄", prop: "age", maxlength: 2 },
                            {
                                type: "select",
                                label: "性别",
                                prop: "sex",
                                options: [
                                    { value: "1", label: "男" },
                                    { value: "2", label: "女" },
                                ],
                                id: "sex"
                            },
                            {
                                type: "select",
                                label: "班级", prop: "class", maxlength: 100,
                                api: "/api/select/getSelectOptions",
                                dep: "sex"
                            },
                        ],
                        width: 1000,
                        api: "/api/add"
                    },
                },
                updateForm: {
                    templateId: "dialog-form",
                    name: "UpdateForm",
                    options: {
                        title: "编辑用户",
                        formItems: [
                            { type: "input", label: "用户名", prop: "username", maxlength: 100 },
                            { type: "input", label: "密码", prop: "password", maxlength: 100 },
                            { type: "input", label: "年龄", prop: "age", maxlength: 2 },
                            {
                                type: "select",
                                label: "性别",
                                prop: "sex",
                                options: [
                                    { value: "1", label: "男" },
                                    { value: "2", label: "女" },
                                ],
                                id: "sex"
                            },
                            {
                                type: "select",
                                label: "班级", prop: "class", maxlength: 100,
                                api: "/api/select/getSelectOptions",
                                dep: "sex"
                            },
                        ],
                        api: "/api/update"
                    }
                },
            },
            components: [
                {
                    templateId: "dialog",
                    namespace: "detail",
                    name: "DetailDialog",
                    options: {
                        title: "详情",
                        width: 500,
                    },
                    components: [
                        {
                            templateId: "normal-table",
                            namespace: "detail",
                            name: "DetailTable",
                            options: {
                                formItems: [
                                    { type: "input", label: "用户名", prop: "username", maxlength: 100 },
                                    { type: "input", label: "密码", prop: "password", maxlength: 100 },
                                    { type: "input", label: "年龄", prop: "age", maxlength: 2 },
                                    {
                                        type: "select",
                                        label: "性别",
                                        prop: "sex",
                                        options: [
                                            { value: "1", label: "男" },
                                            { value: "2", label: "女" },
                                        ],
                                        id: "sex"
                                    },
                                    {
                                        type: "select",
                                        label: "班级", prop: "class", maxlength: 100,
                                        api: "/api/select/getSelectOptions",
                                        dep: "sex"
                                    },
                                ],
                                tableCols: [
                                    { label: "用户名", prop: "username" },
                                    { label: "密码", prop: "password" },
                                    { label: "年龄", prop: "age" },
                                    { label: "班级", prop: "class" },
                                    { label: "备注", prop: "remarks" },
                                    { label: "备注", prop: "remarks" },
                                    { label: "备注", prop: "remarks" },
                                ],
                                hasPagination: true,
                            }
                        }
                    ]
                }
            ]
        })
        ctx.body = "success"
    })

    app.use(router.routes());

    app.listen(9000, () => {
        console.log("ready on: http://localhost:9000");
    })
}

export default createServer
