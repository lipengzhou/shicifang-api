const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: { // 公司/组织名称
    type: String,
    required: true
  },
  position: { // 职位
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
  city: { // 工作城市
    type: String,
    default: ''
  },
  skills: { // 相关技术
    type: String,
    default: ''
  },
  description: { // 职位描述
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

module.exports = workSchema
