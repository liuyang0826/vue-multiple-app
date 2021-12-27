export default function service({ name, data, utils }) {
  return {
    entry: {
      name,
      services: [
        {
          name: "getTreeData",
          method: "get",
          api: data.api,
        }
      ]
    }
  }
}