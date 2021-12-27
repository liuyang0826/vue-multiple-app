export const getTableData = async params => {
  return await http.post('/api/pageList', params)
}

export const doDelete = async params => {
  return await http.post('/api/user/delete', params)
}

export const doBatchDelete = async params => {
  return await http.post('/api/user/batchDelete', params)
}

export const doToggleEnable = async params => {
  return await http.post('/api/user/toggleEnable', params)
}

export const doMove = async params => {
  return await http.post('/api/user/move', params)
}
