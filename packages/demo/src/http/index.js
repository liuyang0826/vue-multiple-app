const http = ["get", "post", "put", "delete"].reduce((acc, method) => {
  acc[method] = (url, data) => {
    return fetch(`http://127.0.0.1:5000${url}`, {
      method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json())
  }
  return acc
}, {})

export default http