//import http from "@http"
const http = () => {}

export const doSubmit = async (params) => {
  return await http.post("/api/add", params)
}

export const getClassOptions = async (params) => {
  return await http.get("/api/select/getSelectOptions", params)
}
