const md5 = require('../utils/md5')
const url = require('url')
const fs = require('fs')
const util = require('util')
const path = require('path')
const gm = require('gm')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

module.exports = async (fastify, opts, next) => {
  const { User, Comment, Post, Work, Education } = fastify.db

  /*
   * 获取用户列表
   */
  fastify.get('/users', async (req, res) => {
    const { nickname, username } = req.query
    const condition = {}
    nickname && (condition.nickname = nickname)
    username && (condition.username = username)
    const ret = await User.find(condition)
    res.code(200).send(ret)
  })

  /**
   * 创建用户
   */
  fastify.post('/users', async (req, res) => {
    const { username, password, nickname } = req.body
    const ret = await new User({
      username,
      password,
      nickname
    }).save()
    res.code(201).send(ret)
  })

  /**
   * 获取用户评论过的内容
   */
  fastify.get('/users/:userId/comments/questions', async (req, res) => {
    const { userId } = req.params
    const ret = await Comment.distinct('postId', {
      userId
    })

    const posts = await Post.find({
      _id: {
        $in: ret
      }
    })

    res.code(200).send(posts)
  })

  /**
   * 更新用户基本信息
   */
  fastify.patch('/users/:userId/profile', {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', default: '' },
        birthday: { type: 'string', default: '' },
        cellphone: { type: 'string', default: '' },
        location: { type: 'string', default: '' },
        skills: { type: 'string', default: '' },
        gender: { type: 'string', default: '保密' },
        website: { type: 'string', default: '' },
        bio: { type: 'string', default: '' }
      },
    }
  }, async (req, res) => {
    const { userId } = req.params
    const {
      name,
      birthday,
      cellphone,
      location,
      skills,
      gender,
      website,
      bio
    } = req.body
    const ret = await User.findOneAndUpdate({
      _id: userId
    }, {
      name,
      birthday,
      cellphone,
      location,
      skills,
      gender,
      website,
      bio
    }, { new: true })
    res.code(201).send(ret)
  })

  /**
   * 更新用户头像
   */
  fastify.patch('/users/:userId/avatar', {
    schema: {
      body: {
        type: 'object',
        properties: {
          file: { type: 'string' },
          x: { type: 'number' },
          y: { type: 'number' },
          width: { type: 'number' },
          height: { type: 'number' }
        },
        required: ['file', 'x', 'y', 'width', 'height']
      }
    }
  }, async (req, res) => {
    const { userId } = req.params
    const {
      file,
      x,
      y,
      width,
      height
    } = req.body
    // 1. 读取 template 中要裁切的图片
    const { pathname } = url.parse(file)
    // 2. 裁切
    gm(`.${pathname}`)
      .crop(width, height, x, y)
      .resize(160, 160)
      .toBuffer((err, buffer) => {
        if (err) {
          throw err
        }
        const fileName = `${md5(buffer)}${path.parse(pathname).ext}`
        const distPath = path.join(__dirname, '../public/img/', fileName)
        fs.writeFile(distPath, buffer, err => {
          if (err) {
            throw err
          }
          User.findOneAndUpdate({
            _id: userId
          }, {
            avatar: `/public/img/${fileName}`
          }, {
            new: true
          }).then(data => {
            res.code(201).send(data)
          })
        })
      })
  })

  /*
   * 获取单个用户
   */
  fastify.get('/users/:userId', async (req, res) => {
    const { userId } = req.params
    const ret = await User.findById(userId)
    res.code(200).send(ret)
  })

  /*
   * 根据 urlToken 获取用户
   */
  fastify.get('/users/url_token/:urlToken', async (req, res) => {
    const { urlToken } = req.params
    const ret = await User.findOne({ urlToken })
    res.code(200).send(ret)
  })

  /*
   * 修改 urlToken
   */
  fastify.patch('/users/:userId/url_token', async (req, res) => {
    const { userId } = req.params
    const { urlToken } = req.body
    const user = await User.findOne({ urlToken })
    if (user) {
      return res.code(409).send({
        error: 'body.urlToken'
      })
    }
    const ret = await User.findOneAndUpdate({
      _id: userId
    }, {
      urlToken
    }, { new: true })
    res.code(200).send(ret)
  })

  /**
   * 用户注册
   */
  fastify.post('/users/signup', {
    schema: {
      body: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            pattern: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
            // format: 'email'
          },
          password: {
            type: 'string',
            pattern: '^[a-zA-Z]\\w{5,17}$'
          },
          nickname: { type: 'string' }
        },
        required: ['email', 'password', 'nickname']
      }
    }
  }, async (req, res) => {
    const { email, password, nickname } = req.body
    if (await User.findOne({ email })) {
      res.code(409).send({
        error: 'body.email'
      })
    }

    if (await User.findOne({ nickname })) {
      res.code(409).send({
        error: 'body.nickname'
      })
    }

    const user = await new User({
      email,
      password: md5(password),
      nickname,
      urlToken: nickname // 个性网址默认和昵称一致
    }).save()

    res.code(201).send(user)
  })

  /**
   * 用户登录
   */
  fastify.post('/users/signin', {
    schema: {
      body: {
        type: 'object',
        properties: {
          email: {
            type: 'string'
          },
          password: {
            type: 'string'
          }
        },
        required: ['email', 'password']
      }
    }
  }, async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      res.code(401).send({
        error: 'body.email'
      })
    }

    if (md5(password) !== user.password) {
      res.code(401).send({
        error: 'body.password'
      })
    }

    res.code(200).send(user)
  })

  /*
   * 更新
   */
  fastify.patch('/users/:id', async (req, res) => {
    const { id } = req.params
    const body = req.body
    const user = await User.findByIdAndUpdate(id, body, { new: true })
    res.code(200).send(user)
  })

  /**
   * 删除用户
   */
  fastify.delete('/users/:id', async (req, res) => {
    await User.findOneAndRemove({ _id: req.params.id })
    res.code(200).send({})
  })

  /**
   * 修改密码
   */
  fastify.patch('/users/:userId/password', {
    schema: {
      body: {
        type: 'object',
        properties: {
          password: {
            type: 'string'
          },
          newPassword: {
            type: 'string'
          }
        },
        required: ['password', 'newPassword']
      }
    }
  }, async (req, res) => {
    const { userId } = req.params
    const { password, newPassword } = req.body

    const user = await User.findOne({ _id: userId })

    if (!user) {
      return res.code(400).send({
        error: 'params.userId'
      })
    }

    if (md5(password) !== user.password) {
      return res.code(400).send({
        error: 'body.password'
      })
    }

    user.password = md5(newPassword)

    await user.save()

    return res.code(201).send({
      msg: 'OK'
    })
  })

  next()
}
