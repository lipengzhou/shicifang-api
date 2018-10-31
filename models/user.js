const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: { // 邮箱
    type: String
  },
  password: { // 密码
    type: String,
    required: true
  },
  urlToken: { // 个性网址，默认和 nickname 一致
    type: String,
    default: ''
  },
  nickname: { // 昵称
    type: String,
    required: true
  },
  username: { // 用户名
    type: String,
    default: ''
  },
  birthday: { // 生日
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  cellphone: { // 电话
    type: String,
    default: ''
  },
  name: { // 真实姓名
    type: String,
    default: ''
  },
  gender: { // 性别
    type: String,
    enum: ['男', '女', '保密'],
    default: '保密'
  },
  avatar: { // 头像
    type: String,
    default: ''
  },
  location: { // 位置
    type: String,
    default: ''
  },
  bio: { // 简介
    type: String,
    default: ''
  },
  skills: { // 技术栈
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

module.exports = userSchema
