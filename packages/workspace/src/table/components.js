import template from "./template.ejs"

export default function components({name, data, resolveComponents}) {
  return [
    {
      template,
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
}