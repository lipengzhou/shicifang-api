const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eduSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  school: { // 学校名称
    type: String,
    required: true
  },
  major: { // 专业方向
    type: String,
    default: ''
  },
  education: { // 学历
    type: String,
    required: true
  },
  startDate: { // 开始时间
    type: String,
    required: true
  },
  endDate: { // 结束时间
    type: String,
    required: true
  },
  description: { // 其他描述
    type: String,
    default: ''
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

module.exports = eduSchema
