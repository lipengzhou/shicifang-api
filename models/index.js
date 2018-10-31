const mongoose = require('mongoose')

module.exports = {
  User: mongoose.model('User', require('./user')),
  Post: mongoose.model('Post', require('./post')),
  Comment: mongoose.model('Comment', require('./comment')),
  Vote: mongoose.model('Vote', require('./vote')),
  Tag: mongoose.model('Tag', require('./tag')),
  Work: mongoose.model('Work', require('./work')),
  Education: mongoose.model('Education', require('./education'))
}
