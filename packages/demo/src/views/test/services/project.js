import http from '../../../http'
export const getTableData = async params => {
  return await http.post('', params)
}
