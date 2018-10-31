module.exports = async (fastify, opts, next) => {
  const { Tag } = fastify.db

  /**
   * 创建
   */
  fastify.post('/tags', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
      }
    }
  }, async(req, res) => {
    const { name } = req.body
    const tag = await new Tag({
      name
    }).save()
    res.code(201).send(tag)
  })

  /**
   * 关注|取消标签
   */
  fastify.post('tags/:tagName/followers', async (req, res, next) => {
    const { tagName } = req.params
    const { userId } = req.body
    const tag = await Tag.findOne({ name: tagName, followers: userId })
    if (tag) {
      // 移除关注者
      await Tag.findOneAndUpdate({ name: tagName }, {
        $pull: {
          followers: userId
        }
      })
    } else {
      // 添加关注者
      await Tag.findOneAndUpdate({
        name: tagName
      }, {
        $push: {
          followers: userId
        }
      })
    }

    const ret = await Tag.findOne({ name: tagName })
    res.send(ret)
  })

  fastify.get('/tags/followers/:userId', async (req, res) => {
    const { userId } = req.params
    const tags = await Tag.find({
      followers: userId
    })
    res.code(200).send(tags)
  })

  /**
   * 获取标签列表
   */
  fastify.get('/tags', {
    schema: {
      querystring: {
        _page: { type: 'number', default: 1 },
        _limit: { type: 'number', default: 20 }
      }
    }
  }, async (req, res) => {
    const { _page, _limit } = req.query
    // 获取热门标签
    
    const tags = await Tag
      .find()
      .sort({ postCount: -1 })
      .skip((_page - 1) * _limit)
      .limit(_limit)
    res.header('X-Total-Count', await Tag.count())
    res.code(200).send(tags)
  })

  /**
   * 查询标签内容
   */
  fastify.get('/tags/:tagName', async (req, res) => {
    const { tagName } = req.params
    
    const ret = await Tag
      .findOne({
        name: tagName
      })
    res.code(200).send(ret)
  })  

  /**
   * 删除
   */
  fastify.delete('/tags/:tagId', async(req, res) => {
    const { tagId } = req.params
    await Tag.findOneAndDelete({ _id: tagId })
    res.code(204).send()
  })

  next()
}
