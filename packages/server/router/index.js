const router = new (require("koa-router"))
const cloudServices = require("../services/cloud")
const demoServices = require("../services/demo")

router.get("/getSchemaById", cloudServices.getSchemaById)
router.post("/previewPage", cloudServices.previewPage)
router.get("/exportProject", cloudServices.exportProject)
router.get("/exportPage", cloudServices.exportPage)
router.post("/uploadCloudFounction", cloudServices.uploadCloudFounction)
router.get("/getHistoryForm", cloudServices.getHistoryForm)
router.get("/getAllSchemas", cloudServices.getAllSchemas)

router.post("/api/user/pageList", demoServices.pageList)
router.post("/api/user/add", demoServices.add)
router.get("/api/org/tree", demoServices.tree)

module.exports = router