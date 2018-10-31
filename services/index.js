const fs = require('fs')
const util = require('util')
const path = require('path')

const writeFile = util.promisify(fs.writeFile)

module.exports = async (fastify, opts, next) => {
  /*
   * 文件上传
   */
  fastify.post('/upload', async (req, res) => {
    const files = req.raw.files
    let fileArr = []
    for(let key in files) {
      const item = files[key]
      const fileName = `${item.md5}${path.parse(item.name).ext}`
      const filePath = path.join(__dirname, '../public/template/', fileName)
      await writeFile(filePath, item.data)
      fileArr.push({
        name: item.name,
        url: `/public/template/${fileName}`
      })
    }
    res.code(201).send(fileArr)
  })
  next()
}
