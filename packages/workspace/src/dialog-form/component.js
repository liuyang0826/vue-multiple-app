import template from "./template.ejs"

export default function component({ name, data }) {
  return {
    entry: {
      template,
      name,
      data
    }
  }
}