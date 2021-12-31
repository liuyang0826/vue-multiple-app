const archiver = require("archiver");

function baseExport(ctx) {
  return async (name, cb) => {
    ctx.status = 200
    ctx.set("Access-Control-Expose-Headers","Content-Disposition")
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.set("Content-Disposition", `attachment;filename=${name}.zip`)

    const archive = archiver('zip')
    archive.pipe(ctx.res);

    await cb(archive)
    
    await Promise.resolve().then(() => archive.finalize())
  }
}

module.exports = baseExport