module.exports = async (fastify, opts, next) => {
  const { db } = fastify
  const { Vote, Post, Comment } = db

  /**
   * 获取用户对 post|comment 的投票信息
   */
  fastify.get('/votes', async (req, res) => {
    const { type, typeId, userId } = req.query
    console.log(req.query)
    const condition = {}
    type && (condition.type = type)
    typeId && (condition.typeId = typeId)
    userId && (condition.userId = userId)
    const ret = await Vote.find(condition)
    res.code(200).send(ret)
  })

  /**
   * 创建|更新投票
   */
  fastify.post('/votes', {
    schema: {
      body: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          value: { type: 'number' },
          type: { type: 'string', enum: ['posts', 'comments'] },
          typeId: { type: 'string' }
        },
        required: ['userId', 'value', 'type', 'typeId']
      }
    }
  }, async (req, res) => {
    const { userId, value, type, typeId } = req.body

    let vote = await Vote.findOne({
      type,
      typeId,
      userId
    })

    if (vote) {
      vote.value = value === vote.value ? 0 : value
      await vote.save()
    } else {
      vote = await new Vote({
        type,
        typeId,
        userId,
        value
      }).save()
    }

    const voteCount = await Vote.getValidCount(type, typeId)

    // 更新 Post 或者 Comment 的 vote 数量
    if (type === 'posts') {
      await Post.findByIdAndUpdate(typeId, {
        voteCount
      })
    } else if (type === 'comments') {
      await Comment.findByIdAndUpdate(typeId, {
        voteCount
      })
    }

    res.header('X-Vote-Count', voteCount)

    res.code(201).send(vote)
  })

  next()
}
