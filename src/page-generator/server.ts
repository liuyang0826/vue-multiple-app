import Koa from "koa"
import KoaRouter from "koa-router"
import writeFile from "./write-file"

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
                    {
                        type: "input",
                        props: { label: "用户名", prop: "username", maxlength: 100, }
                    },
                    {
                        type: "input",
                        props: { label: "密码", prop: "password", maxlength: 100, }
                    },
                    {
                        type: "input",
                        props: { label: "年龄", prop: "age", maxlength: 2 }
                    },
                    {
                        type: "select",
                        props: { label: "性别", prop: "sex" },
                        options: [
                            { value: "1", label: "男" },
                            { value: "2", label: "女" },
                        ],
                        id: "sex"
                    },
                    {
                        type: "select",
                        props: {  label: "班级", prop: "class", maxlength: 100, },
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
                            {
                                type: "input",
                                props: { label: "用户名", prop: "username", maxlength: 100, required: true },
                            },
                            // { label: "年龄", prop: "age", maxlength: 2, required: true },
                            {
                                type: "input",
                                props: { label: "密码", prop: "password", maxlength: 100, required: true },
                            },
                            {
                                type: "input",
                                props: { label: "班级", prop: "class", maxlength: 100 },
                            },
                            {
                                type: "select",
                                props: { label: "性别", prop: "sex" },
                                options: [
                                    { value: "1", label: "男" },
                                    { value: "2", label: "女" },
                                ],
                                id: "sex"
                            },
                        ],
                        width: 1000,
                        api: "/api/add"
                    },
                    components: [
                        {
                            templateId: "normal-table",
                            name: "DataTable",
                            options: {
                                formItems: [
                                    {
                                        type: "input",
                                        props: { label: "用户名", prop: "username", maxlength: 100 }
                                    },
                                    {
                                        type: "input",
                                        props: { label: "密码", prop: "password", maxlength: 100, }
                                    },
                                    {
                                        type: "input",
                                        props: { label: "年龄", prop: "age", maxlength: 2 }
                                    },
                                    {
                                        type: "select",
                                        props: { label: "性别", prop: "sex" },
                                        options: [
                                            { value: "1", label: "男" },
                                            { value: "2", label: "女" },
                                        ],
                                        id: "sex"
                                    },
                                    {
                                        type: "select",
                                        props: {  label: "班级", prop: "class", maxlength: 100, },
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
                },
                updateForm: {
                    templateId: "dialog-form",
                    name: "UpdateForm",
                    options: {
                        title: "编辑用户",
                        formItems: [
                            {
                                type: "input",
                                props: { label: "用户名", prop: "username", maxlength: 100, required: true },
                            },
                            // { label: "年龄", prop: "age", maxlength: 2, required: true },
                            {
                                type: "input",
                                props: { label: "密码", prop: "password", maxlength: 100, required: true },
                            },
                            {
                                type: "input",
                                props: { label: "班级", prop: "class", maxlength: 100 },
                            },
                            {
                                type: "select",
                                props: { label: "性别", prop: "sex" },
                                options: [
                                    { value: "1", label: "男" },
                                    { value: "2", label: "女" },
                                ],
                                id: "sex"
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
                    name: "Detail",
                    options: {
                        title: "详情",
                        width: 500,
                    }
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
