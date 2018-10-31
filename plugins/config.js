const fp = require('fastify-plugin')

module.exports = fp(async (fastify, options, next) => {
  fastify.decorate('config', require('../config/config.default'))
  next()
})
