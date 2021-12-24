export const getTableData = async params => {
  return await http.post('/api/pageList', params)
}

export const add = async params => {
  return await http.post('', params)
}

export const doToggleEnable = async params => {
  return await http.post('', params)
}
