const app = new (require("koa"))
const router = require("./router")
const createMiddleware = require("./middlewares/createMiddleware")
const schemaMiddleware = require("./middlewares/schemaMiddleware")
const renderMiddleware = require("./middlewares/renderMiddlemare")
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');

app.use(cors({
  allowHeaders: ["*"],
}))
app.use(bodyParser())
app.use(renderMiddleware())
app.use(createMiddleware())
app.use(schemaMiddleware())
app.use(router.routes())

app.listen("5000", () => {
  console.log("ready on: http://127.0.0.1:5000");
})