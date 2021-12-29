export default function service({ name, data, utils, resolveService }) {
  return {
    entry: {
      name,
      services: [
        {
          name: "getTreeData",
          method: "get",
          api: data.dataApi,
        },
        data.hasDelete && {
          name: "doDelete",
          method: "post",
          api: data.deleteApi,
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