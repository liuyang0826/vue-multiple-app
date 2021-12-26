export default function services({ name, data, utils }) {
  return [
    {
      name,
      services: [
        {
          name: "submit",
          method: "post",
          api: data.api,
        }
      ]
    }
  ]
}