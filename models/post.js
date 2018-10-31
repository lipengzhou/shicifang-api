const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: { // 标题
    type: String,
    required: true
  },
  body: { // 内容
    type: String,
    required: true
  },
  tags: { // 标签
    type: [String],
    required: true
  },
  userId: { // 用户id
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  voteCount: { // 投票数
    type: Number,
    default: 0
  },
  pv: { // 浏览量
    type: Number,
    default: 0
  },
  commentCount: {
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

module.exports = postSchema
