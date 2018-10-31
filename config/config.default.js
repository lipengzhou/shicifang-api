const path = require('path')

module.exports = {
  uploadPath: resolve('../public/template/'),
  imgPath: resolve('../public/img/')
}

function resolve(filename) {
  return path.join(__dirname, filename)
}
