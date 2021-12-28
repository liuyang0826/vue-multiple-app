const userList = [
  { name: "张三", age: 10, sex: 1 },
  { name: "李四", age: 20, sex: 1 },
]

async function pageList(ctx) {
  await new Promise(resolve => {
    setTimeout(() => {
      ctx.type = "json"
      ctx.body = JSON.stringify({
        status: true,
        data: {
          result: userList,
          total: userList.length
        }
      })
      resolve()
    }, 1000)
  })
}

async function add(ctx) {
  const { name, age, sex } = ctx.request.body
  userList.push({ name, age, sex })
  ctx.type = "json"
  ctx.body = JSON.stringify({
    status: true
  })
}

module.exports = {
  pageList,
  add
}