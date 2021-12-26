const fs = require("fs")
const path = require("path")

const table = {
  schemas: fs.readFileSync(path.resolve("templates/schemas/table.ejs"), "utf8"),
  async components({name, data, resolveComponents}) {
    return [
      {
        template: fs.readFileSync(path.resolve("templates/files/table.ejs"), "utf8"),
        name,
        data,
      },
      data.hasAdd && resolveComponents("dialog-form", {
        name: "AddForm",
        data: data.addForm
      }),
      data.hasUpdate && resolveComponents("dialog-form", {
        name: "UpdateForm",
        data: data.updateForm
      }),
    ].filter(Boolean)
  },
  services({data, utils, name, resolveServices}) {
    const {firstToUpperCase} = utils
    return [
      {
        name,
        services: [
          {
            name: "getTableData",
            method: "post",
            api: "/api/pageList",
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
        ]
      },
      data.hasAdd && resolveServices("dialog-form", {
        name: "addForm",
        data: data.addForm
      }),
      data.hasUpdate && resolveServices("dialog-form", {
        name: "updateForm",
        data: data.updateForm
      })
    ]
  }
}

module.exports = table