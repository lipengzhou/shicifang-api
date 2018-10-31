const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new Schema({
  name: { // 标签名称
    type: String,
    required: true
  },
  postCount: { // 内容数量
    type: Number,
    default: 0
  },
  createdAt: { // 创建时间
    type: Number,
    default: Date.now
  },
  followers: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
  updatedAt: { // 更新时间
    type: Number,
    default: Date.now
  }
})

module.exports = tagSchema
