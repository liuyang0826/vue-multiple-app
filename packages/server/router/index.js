const router = new (require("koa-router"))
const schemaServices = require("../services/schema")
const {firstToUpperCase} = require("../utils")
const autoFormWidth = require("../utils/auto-form-width")

router.post("/submit", async (ctx, next) => {
    console.log(JSON.stringify(ctx.request.body))
    const data = ctx.request.body
    try {
        ctx.status = 200
        await ctx.create("table", data, {
            type: "vue",
            path: "test/Index.vue"
        })

        if (data.hasAdd) {
            const addForm = data.addForm
            await ctx.create("dialog-form", {
                ...addForm,
                apiName: "add",
                dialogWidth: autoFormWidth(addForm.formItems),
            }, {
                type: "vue",
                path: "test/components/AddForm.vue"
            })
        }

        if (data.hasUpdate) {
            const updateForm = data.updateForm
            await ctx.create("dialog-form", {
                ...updateForm,
                apiName: "update",
                dialogWidth: autoFormWidth(updateForm.formItems),
            }, {
                type: "vue",
                path: "test/components/UpdateForm.vue"
            })
        }
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
                    api: data.addForm.api,
                },
                data.hasUpdate && {
                    name: "update",
                    method: "post",
                    api: data.updateForm.api,
                },
                data.hasDelete && {
                    name: "doDelete",
                    method: "post",
                    api: data.deleteApi,
                },
                data.hasBatchDelete && {
                    name: "doBatchDelete",
                    method: "post",
                    api: data.batchDeleteApi,
                },
                data.hasToggleEnable && {
                    name: "doToggleEnable",
                    method: "post",
                    api: data.toggleEnableApi,
                },
                data.hasMove && {
                    name: "doMove",
                    method: "post",
                    api: data.moveApi,
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