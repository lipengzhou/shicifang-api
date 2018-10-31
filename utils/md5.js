const crypto = require('crypto')

module.exports = function (str) {
  const hash = crypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}
