const mongoose = require('mongoose')
const models = require('../models/')
const fp = require('fastify-plugin')

module.exports = fp(async(fastify, options, next) => {
  mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true
  })

  const db = mongoose.connection

  db.on('error', (err) => {
    console.error('数据库连接失败', err)
  })

  db.once('open', () => {
    console.log('数据库连接成功')
  })
  
  fastify.decorate('db', models)

  next()
})
