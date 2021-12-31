async function resolveWalker(promise, cb) {
  async function fn({entry, children}, prefix = "") {
    if (prefix) {
      entry.name = prefix + entry.name
    }
    await cb(entry)
    if (children && children.filter(Boolean).length) {
      for (let i = 0; i < children.length; i++) {
        const item = children[i]
        item && await fn(await item, entry.name)
      }
    }
  }

  await fn(await promise)
}

module.exports = resolveWalker