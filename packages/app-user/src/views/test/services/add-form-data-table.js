//import http from "@http"
const http = () => {}

export const getTableData = async (params) => {
  return await http.get("/api/list", params)
}

export const getClassOptions = async (params) => {
  return await http.get("/api/select/getSelectOptions", params)
}
