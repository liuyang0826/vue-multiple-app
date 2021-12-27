export default function service({ name, data, utils }) {
  return {
    entry: {
      name,
      services: [
        {
          name: "submit",
          method: "post",
          api: data.api,
        }
      ]
    }
  }
}