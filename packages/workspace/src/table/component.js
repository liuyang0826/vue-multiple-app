import template from "./template.ejs"

export default function component({name, data, resolveComponent}) {
  return {
    entry: {
      template,
      name,
      data,
    },
    children: [
      data.hasAdd && resolveComponent("dialog-form", {
        name: "AddForm",
        data: data.addForm
      }),
      data.hasUpdate && resolveComponent("dialog-form", {
        name: "UpdateForm",
        data: data.updateForm
      }),
    ]
  }
}