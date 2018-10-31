module.exports = async(fastify, opts, next) => {
  const { Education } = fastify.db

  /**
   * 创建
   */
  fastify.post('/educations', async(req, res) => {
    const body = req.body
    const ret = await new Education({
      user: body.user,
      school: body.school,
      major: body.major,
      education: body.education,
      startDate: body.startDate,
      endDate: body.endDate,
      description: body.description
    }).save()
    res.code(201).send(ret)
  })

  /**
   * 获取单个
   */
  fastify.get('/educations/:id', async(req, res) => {
    const ret = await Education.findOne({ _id: req.params.id })
    res.code(200).send(ret)
  })

  /**
   * 获取所有
   */
  fastify.get('/educations', async(req, res) => {
    const ret = await Education.find()
    res.code(200).send(ret)
  })

  /**
   * 获取指定用户内容
   */
  fastify.get('/users/:userId/educations', async(req, res) => {
    const ret = await Education.find({
      user: req.params.userId
    })
    res.code(200).send(ret)
  })

  /**
   * 删除
   */
  fastify.delete('/educations/:id', async(req, res) => {
    const ret = await Education.findOneAndRemove({
      _id: req.params.id
    })
    res.code(204).send(ret)
  })

  /**
   * 更新
   */
  fastify.patch('/educations/:id', async(req, res) => {
    const ret = await Education.findOneAndUpdate({
      _id: req.params.id
    }, req.body)
    res.code(204).send(ret)
  })

  next()
}
