module.exports = async(fastify, opts, next) => {
  const { Work } = fastify.db

  /**
   * 创建
   */
  fastify.post('/works', async(req, res) => {
    const body = req.body
    const ret = await new Work({
      user: body.user,
      company: body.company,
      position: body.position,
      startDate: body.startDate,
      endDate: body.endDate,
      city: body.city,
      skills: body.skills,
      description: body.description
    }).save()
    res.code(201).send(ret)
  })

  /**
   * 获取单个
   */
  fastify.get('/works/:id', async(req, res) => {
    const ret = await Work.findOne({ _id: req.params.id })
    res.code(200).send(ret)
  })

  /**
   * 获取所有
   */
  fastify.get('/works', async(req, res) => {
    const ret = await Work.find()
    res.code(200).send(ret)
  })

  /**
   * 获取指定用户内容
   */
  fastify.get('/users/:userId/works', async(req, res) => {
    const ret = await Work.find({
      user: req.params.userId
    })
    res.code(200).send(ret)
  })

  /**
   * 删除
   */
  fastify.delete('/works/:id', async(req, res) => {
    const ret = await Work.findOneAndRemove({
      _id: req.params.id
    })
    res.code(204).send(ret)
  })

  /**
   * 更新
   */
  fastify.patch('/works/:id', async(req, res) => {
    const ret = await Work.findOneAndUpdate({
      _id: req.params.id
    }, req.body)
    res.code(204).send(ret)
  })

  next()
}
