module.exports = async (fastify, opts, next) => {
  const { db, jwt } = fastify
  const { User } = db

  fastify.get('/', async (request, res) => {
    res.send('hello world')
  })

  next()
}
