const fs = require("fs")
const path = require("path")
const Koa = require("koa")
const KoaRouter = require("koa-router")

const baseTemplate = require("./base-template")
const { finishInject, firstToLowerCase } = require("./utils")

function main(config) {
    const root = firstToLowerCase(config.name)
    const writeComponentFile = (options, type) => {
        const data = finishInject(baseTemplate(options))
        const fileName = type === "page" ? `Index.vue` : `components/${options.name}.vue`
        const rootDir = path.join(process.cwd(), `../packages/app-user/src/views/${root}`)
        if (!fs.existsSync(rootDir)) {
            fs.mkdirSync(rootDir)
        }
        const componentsDir = path.join(rootDir, "components")
        if (type !== "page" && !fs.existsSync(componentsDir)) {
            fs.mkdirSync(componentsDir)
        }
        fs.writeFileSync(path.join(rootDir, fileName), data)
    }

    function run(config, type) {
        const { options, components, services } = require(`./${config.templateId}`).process(config)
        writeComponentFile(options, type);
        components.forEach((options) => {
            run(options, "component")
        })
    }
    run(config, "page")
}

const app = new Koa()
const router = new KoaRouter();
router.get("/", async (ctx) => {
  main({
      templateId: "normal-table",
      name: "Test",
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
      // hasPagination: true,
      addDialog: {
          templateId: "dialog-form",
          name: "AddForm",
          formItems: [
              { label: "用户名", prop: "username", maxlength: 100, required: true },
              { label: "密码", prop: "password", maxlength: 100, required: true },
              // { label: "年龄", prop: "age", maxlength: 2, required: true },
              { label: "班级", prop: "class", maxlength: 100 },
          ]
      },
      editDialog: {
          templateId: "dialog-form",
          name: "EditForm",
          formItems: [
              { label: "用户名", prop: "username", maxlength: 100, required: true },
              { label: "密码", prop: "password", maxlength: 100, required: true },
              // { label: "年龄", prop: "age", maxlength: 2, required: true },
              { label: "班级", prop: "class", maxlength: 100 },
          ],
      },
      components: []
  })
    ctx.body = "success"
})

app.use(router.routes());

app.listen(9000, () => {
    console.log("ready on: http://localhost:9000");
})