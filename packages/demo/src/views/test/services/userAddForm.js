export const submit = async params => {
  return await http.post('/api/user/add', params)
}
