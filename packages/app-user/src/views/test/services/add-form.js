//import http from "@http"
const http = () => {}

export const doSubmit = async (params) => {
  return await http.post("/api/addUser", params)
}

export const getSizeOptions = async (params) => {
  return await http.get("/api/sizes", params)
}
