export default function service({data, utils, name, resolveService}) {
  const {firstToUpperCase} = utils
  return {
    entry: {
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
    children: [
      data.hasAdd && resolveService("dialog-form", {
        name: "addForm",
        data: data.addForm
      }),
      data.hasUpdate && resolveService("dialog-form", {
        name: "updateForm",
        data: data.updateForm
      })
    ]
  }
}