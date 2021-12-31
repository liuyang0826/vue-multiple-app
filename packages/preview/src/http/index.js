function serializeObject(data) {
  if (!data) {
    return ""
  }
  const items = Object.keys(data).map((key) => {
    return `${key}=${data[key]}`
  })
  return items.join("&")
}

const http = ["get", "post", "put", "delete"].reduce((acc, method) => {
  acc[method] = (url, data, options = {}) => {
    let input = `http://127.0.0.1:5000${url}`
    let body
    if (method === "get") {
      const query = serializeObject(data)
      if (query) {
        input += `?${query}`
      }
    } else {
      body = JSON.stringify(data)
    }
    return fetch(input, {
      method,
      body,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
    }).then(res => res.json())
  }
  return acc
}, {})

export default http