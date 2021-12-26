import template from "./template.ejs"

export default function components({ name, data }) {
  return [
    {
      template,
      name,
      data
    }
  ]
}