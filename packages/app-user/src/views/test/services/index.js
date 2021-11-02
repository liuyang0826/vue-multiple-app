import http from "@http"

export const getTableData = async (params) => {
  return await http.get("/api/list", params)
}

export const update = async (params) => {
  return await http.post("/api/update", params)
}

export const add = async (params) => {
  return await http.post("/api/add", params)
}
