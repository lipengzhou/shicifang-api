const mongoose = require('mongoose')
const Schema = mongoose.Schema

const voteSchema = new Schema({
  type: { // 类型
    type: String,
    required: true,
    enum: ['posts', 'comments']
  },
  typeId: { // 类型id
    type: Schema.Types.ObjectId,
    required: true
  },
  userId: { // 用户id
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  value: { // 分值
    type: Number,
    enum: [0, 1, -1]
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

voteSchema.statics.getValidCount = async function (type, typeId) {
  const Vote = this
  const votes = await Vote.count({
    type,
    typeId
  })

  return votes.reduce((prev, curr) => prev + curr.value, 0)
}

module.exports = voteSchema
