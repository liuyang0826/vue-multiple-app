const Koa = require("koa")
const KoaRouter = require("koa-router")
const writeFile = require("./write-file")

const createServer = () => {
    const app = new Koa()
    const router = new KoaRouter();

    router.get("/:templateId", async (ctx) => {
        ctx.body = require(`./${ctx.params.templateId}`).descriptions
    })

    router.get("/", async (ctx) => {
        writeFile({
            templateId: "normal-table",
            name: "Test",
            options: {
                formItems: [
                    { label: "用户名", prop: "username", maxlength: 100 },
                    { label: "密码", prop: "password", maxlength: 100 },
                    { label: "年龄", prop: "age", maxlength: 2 },
                    { label: "班级", prop: "class", maxlength: 100 },
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
                    parentOptions: {
                        title: "新增用户"
                    },
                    options: {
                        formItems: [
                            { label: "用户名", prop: "username", maxlength: 100, required: true },
                            { label: "密码", prop: "password", maxlength: 100, required: true },
                            // { label: "年龄", prop: "age", maxlength: 2, required: true },
                            { label: "班级", prop: "class", maxlength: 100 },
                        ]
                    }
                },
                updateForm: {
                    templateId: "dialog-form",
                    name: "UpdateForm",
                    parentOptions: {
                        title: "编辑用户"
                    },
                    options: {
                        formItems: [
                            { label: "用户名", prop: "username", maxlength: 100, required: true },
                            { label: "密码", prop: "password", maxlength: 100, required: true },
                            // { label: "年龄", prop: "age", maxlength: 2, required: true },
                            { label: "班级", prop: "class", maxlength: 100 },
                        ],
                    }
                },
            },
        })
        ctx.body = "success"
    })

    app.use(router.routes());

    app.listen(9000, () => {
        console.log("ready on: http://localhost:9000");
    })
}

module.exports = createServer
