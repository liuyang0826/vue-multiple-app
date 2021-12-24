const router = new (require("koa-router"))
const schemaServices = require("../services/schema")
const {firstToUpperCase} = require("../utils")

router.post("/submit", async (ctx, next) => {
    console.log(ctx.request.body)
    const data = ctx.request.body
    try {
        ctx.status = 200
        await ctx.create("table", data, {
            type: "vue",
            path: "test/Index.vue"
        })
        data.hasAdd && await ctx.create("dialog-form", {
            ...data.addForm,
            apiName: "add",
        }, {
            type: "vue",
            path: "test/components/AddForm.vue"
        })
        data.hasUpdate && await ctx.create("dialog-form", {
            ...data.updateForm,
            apiName: "update",
        }, {
            type: "vue",
            path: "test/components/UpdateForm.vue"
        })
        await ctx.create("service", {
            services: [
                {
                    name: "getTableData",
                    method: "post",
                    api: "/api/pageList",
                },
                data.hasAdd && {
                    name: "add",
                    method: "post",
                    api: "/api/add",
                },
                data.hasUpdate && {
                    name: "update",
                    method: "post",
                    api: "/api/update",
                },
                data.hasDelete && {
                    name: "deleteItem",
                    method: "post",
                    api: "/api/delete",
                },
                data.hasBatchDelete && {
                    name: "deleteBatch",
                    method: "post",
                    api: "/api/deleteBatch",
                },
                ...data.searchItems.filter(d => d.type === "select" && d.optionType === "api").map((item) => {
                  return {
                      name: `get${firstToUpperCase(item.prop)}Options`,
                      method: "get",
                      api: item.api,
                  }
                })
            ].filter(Boolean)
        }, {
            type: "js",
            path: "test/services/index.js"
        })
        ctx.body = "success"
    } catch(e) {
        console.log(e);
    }
    await next()
})

router.get("/getSchemaById", schemaServices.getSchemaById)

module.exports = router