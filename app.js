const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = function (fastify, opts, next) {
  fastify.register(require('fastify-cors'), {})
  
  fastify.register(require('fastify-formbody'))

  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
  })

  fastify.register(require('fastify-jwt'), { 
    secret: 'lipengzhou'
  })

  fastify.register(require('fastify-file-upload'), {
    limits: { fileSize: 50 * 1024 * 1024 }
  })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({
      prefix: '/api/v1/'
    }, opts)
  })

  fastify.ready(() => {
    console.log(fastify.printRoutes())
    // └── /
    //   ├── test (GET)
    //   │   └── /hello (GET)
    //   └── hello/world (GET)
  })

  // Make sure to call next when done
  next()
}
