const router = new (require("koa-router"))
const cloudServices = require("../services/cloud")

router.get("/getSchemaById", cloudServices.getSchemaById)

router.post("/submit", cloudServices.submit)

module.exports = router