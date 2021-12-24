const path = require('path')
const app = new (require("koa"))
const artTemplate = require('koa-art-template');
const template = require('art-template');
const router = require("./router")
const createMiddleware = require("./middlewares/create-middleware")
const schemaMiddleware = require("./middlewares/schema-middleware")
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const {firstToUpperCase, split} = require("./utils")
const parseDefaultFunction = require("./filters/parse-default-function")

artTemplate(app, {
    root: path.resolve('templates'),
    extname: '.ejs',
    debug: true,
    cache: false
})

template.defaults.rules.pop()
template.defaults.imports.firstToUpperCase = firstToUpperCase
template.defaults.imports.split = split
template.defaults.imports.parseDefaultFunction = parseDefaultFunction

app.use(cors({
    allowHeaders: ["*"],
}))

app.use(bodyParser())

app.use(createMiddleware())
app.use(schemaMiddleware())

app.use(router.routes())

app.listen("5000", () => {
    console.log("ready on: http://127.0.0.1:5000");
})