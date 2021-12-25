const fs = require("fs")
const path = require("path")

const schemaTemplate = fs.readFileSync(path.resolve("templates/schemas/table.ejs"), "utf8")

const table = {
  template: fs.readFileSync(path.resolve("templates/files/table.ejs"), "utf8"),
  async schema({ resolveSchema }) {
    return {
      template: schemaTemplate,
      data: {
        dialogForm: await resolveSchema("dialog-form")
      }
    }
  },
  async components({ data, resolveTemplate }) {
    const dialogFormTemplate = await resolveTemplate("dialog-form")
    return [
      data.hasAdd && {
        template:  dialogFormTemplate,
        name: "AddForm",
        data: {
          ...data.addForm,
          apiName: "add",
        }
      },
      data.hasUpdate && {
        template:  dialogFormTemplate,
        name: "UpdateForm",
        data: {
          ...data.updateForm,
          apiName: "update",
        }
      }
    ].filter(Boolean)
  },
  services({ data, utils }) {
    const { firstToUpperCase } = utils
    return [
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
  }
}

module.exports = table