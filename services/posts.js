module.exports = async(fastify, opts, next) => {
  const { Post, Vote, Comment, Tag, User } = fastify.db

  // fastify.get('/generate', async(req, res, next) => {
  //   for (let i = 0; i < 100; i++) {
  //     await new Post({
  //       title: 'title' + i,
  //       body: 'body' + i,
  //       tags: 'tag' + i,
  //       userId: '5b9be3c29ac8a01c7ade7262'
  //     }).save()
  //   }
  //   res.send('写入成功')
  // })

  // fastify.get('/clear', async(req, res, next) => {
  //   for (let i = 0; i < 100; i++) {
  //     await new Post({
  //       title: '测试标题' + i,
  //       body: '测试内容' + i,
  //       tags: '测试标签' + i,
  //       userId: '5b9be3c29ac8a01c7ade7262'
  //     }).save()
  //   }
  //   res.send('写入成功')
  // })

  /*
   * 获取列表
   */
  fastify.get('/posts', {
    schema: {
      querystring: {
        _page: { type: 'number', default: 1 },
        _limit: { type: 'number', default: 20 },
        filter: { type: 'string', enum: ['hot', 'unresponsive', ''] },
        userId: { type: 'string' },
        tags: { type: 'string', default: '' }
      }
    }
  }, async(req, res) => {
    const { userId, filter, _page, _limit, tags } = req.query
    const condition = {}
    if (tags.length) {
      condition.tags = tags
    }
    const sortCondition = {}
    userId && (condition.userId = userId)
    switch (filter) {
      case 'hot': // 热门
        condition.commentCount = { $gte: 1 }
        sortCondition.commentCount = -1 // 热门，按照回复数量倒序排序
        break
      case 'unresponsive': // 等待回复，所有回复数为0内容，按照创建时间倒序排序
        condition.commentCount = 0
        sortCondition.createdAt = -1
        break
      default:
        sortCondition.createdAt = -1 // 最新，按照创建时间倒叙排序
        break
    }
    const ret = await Post
      .find(condition)
      .sort(sortCondition)
      .skip((_page - 1) * _limit)
      .limit(_limit)
    res.header('X-Total-Count', await Post.count(condition))
    res.code(200).send(ret)
  })

  /*
   * 获取单个
   */
  fastify.get('/posts/:postId', async(req, res) => {
    const { postId } = req.params
    const ret = await Post
      .findOne({ _id: postId })
    res.code(200).send(ret)
  })

  /*
   * 创建
   */
  fastify.post('/posts', {
    schema: {
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          body: { type: 'string' },
          userId: { type: 'string' },
          tags: { type: 'string' }
        },
        required: ['title', 'body', 'userId', 'tags']
      }
    }
  }, async(req, res) => {
    const { title, body, userId } = req.body
    let { tags } = req.body

    tags = tags.split(',').reduce((prev, curr) => {
      prev.push(curr.trim().toLowerCase())
      return prev
    }, [])

    // 创建 tags
    for (let i = 0; i < tags.length; i++) {
      const item = tags[i]
      let tag = await Tag.findOne({
        name: item
      })
      if (!tag) {
        tag = new Tag({
          name: item,
          postCount: 1
        })
      } else {
        tag.postCount++
      }
      await tag.save()
    }

    const ret = await new Post({
      title,
      body,
      tags,
      userId
    }).save()
    
    res.code(201).send(ret)
  })

  /*
   * 更新
   */
  fastify.patch('/posts/:postId', async(req, res) => {
    const { postId } = req.params
    const { title, body, tags } = req.body
    const ret = await Post.findByIdAndUpdate(postId, {
      title,
      body,
      tags,
      updatedAt: Date.now()
    }, { new: true })
    res.code(201).send(ret)
  })

  /**
   * 删除
   */
  fastify.delete('/posts/:postId', async(req, res) => {
    const { postId } = req.params
    const post = await Post.findOneAndDelete({ _id: postId })
    res.code(204).send()
  })

  next()
}
