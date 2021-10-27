const withMultipleApp = require("../../src/with-multiple-app")

module.exports = withMultipleApp({
    name: "app_user",
    port: 8082
})()