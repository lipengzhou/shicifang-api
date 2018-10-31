module.exports = async (fastify, opts, next) => {
  const { Comment, Post } = fastify.db

  /**
   * 获取回复列表
   */
  fastify.get('/comments', {
    schema: {
      querystring: {
        _page: { type: 'number', default: 1 },
        _limit: { type: 'number', default: 20 },
        postId: { type: 'string' }
      }
    }
  }, async (req, res) => {
    const { postId, _page, _limit } = req.query
    const condition = {}
    postId && (condition.postId = postId)
    const ret = await Comment
      .find(condition)
      .skip((_page - 1) * _limit)
      .limit(_limit)
    const totalCount = await Comment.count()
    res.header('X-Total-Count', totalCount)
    res.code(200).send(ret)
  })

  fastify.get('/comments/count', async (req, res) => {
    const { postId } = req.query
    const condition = {}
    postId && (condition.postId = postId)
    const ret = await Comment.count(condition)
    console.log(ret)
    res.code(200).send(ret)
  })

  /*
   * 获取单个
   */
  fastify.get('/comments/:id', async (req, res) => {
    const { id } = req.params
    const ret = await Comment.findById(id)
    res.code(200).send(ret)
  })

  /*
   * 创建
   */
  fastify.post('/comments', {
    schema: {
      body: {
        type: 'object',
        properties: {
          body: { type: 'string' },
          userId: { type: 'string' },
          postId: { type: 'string' }
        },
        required: ['body', 'userId', 'postId']
      }
    }
  }, async (req, res) => {
    const { body, userId, postId } = req.body
    const ret = await new Comment({
      body,
      userId,
      postId
    }).save()
    
    // 更新内容的回复数量
    await Post.findOneAndUpdate({ _id: postId }, {
      commentCount: await Comment.countDocuments({ postId })
    })

    res.code(201).send(ret)
  })
  
  /*
   * 更新
   */
  fastify.patch('/comments/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req.body
    const ret = await Comment.findByIdAndUpdate(id, {
      body
    }, { new: true })
    res.code(201).send(ret)
  })

  /**
   * 删除
   */
  fastify.delete('/comments/:commentId', async (req, res) => {
    const { commentId } = req.params
    const comment = await Comment.findById(commentId)
    const postId = comment.postId
    await comment.remove()
    await Post.findOneAndUpdate({ _id: postId }, {
      commentCount: await Comment.countDocuments({ postId })
    })
    res.code(204).send({})
  })

  next()
}
