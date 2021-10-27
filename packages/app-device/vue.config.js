const withMultipleApp = require("../../src/with-multiple-app")

module.exports = withMultipleApp({
    name: "app_device",
    port: 8081
})()