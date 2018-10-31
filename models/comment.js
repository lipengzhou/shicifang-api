const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  body: { // 内容
    type: String,
    required: true
  },
  userId: { // 用户id
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  postId: { // 文章id
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  },
  voteCount: { // 投票数
    type: Number,
    default: 0
  },
  createdAt: { // 创建时间
    type: Number,
    default: Date.now
  },
  updatedAt: { // 更新时间
    type: Number,
    default: Date.now
  }
})

module.exports = commentSchema
