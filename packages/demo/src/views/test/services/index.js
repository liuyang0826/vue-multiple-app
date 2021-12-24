export const getTableData = async params => {
  return await http.post('/api/pageList', params)
}

export const doDelete = async params => {
  return await http.post('', params)
}

export const doBatchDelete = async params => {
  return await http.post('', params)
}

export const doToggleEnable = async params => {
  return await http.post('', params)
}

export const doMove = async params => {
  return await http.post('', params)
}
