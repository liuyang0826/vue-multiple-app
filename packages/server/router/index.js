const router = new (require("koa-router"))
const cloudServices = require("../services/cloud")

router.get("/getSchemaById", cloudServices.getSchemaById)
router.post("/submit", cloudServices.submit)
router.post("/uploadCloudFounction", cloudServices.uploadCloudFounction)
router.get("/getHistoryForm", cloudServices.getHistoryForm)

module.exports = router