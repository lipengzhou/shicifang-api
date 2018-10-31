# 十次方 API 接口文档

## 接口部署

### 安装 mongodb

- 下载 mongodb
  + 下载地址：https://www.mongodb.com/download-center/community
- 安装方式
  + [在 Linux 上安装 mongodb](https://docs.mongodb.com/manual/administration/install-on-linux/)
  + [在 macOS 上安装 mongodb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
  + [在 Windows 上安装 mongodb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
- 安装好以后在终端中执行 `mongod` 命令启动 mongodb 数据库

> 不明白的也可以参考这篇安装配置教程：http://www.runoob.com/mongodb/mongodb-window-install.html

### 安装接口项目依赖

在终端中进入接口项目目录并执行以下命令

```bash
npm install
```

### 启动接口服务

> 注意：启动服务之前务必保证先启动 mongodb 数据库

```bash
npm run dev
```

---

## 接口说明

## 用户

### 创建用户

> `POST` /users

BODY

```json
{
  "username": "xxx",
  "password": "xxx",
  "nickname": "xxx"
}
```

### 根据用户 id 查询用户信息

> `GET` /users/:userId

### 根据用户名查询用户

> `GET` /users?username=xxx

### 根据昵称查询用户

> `GET` /users?nickname=xxx

### 根据 url_token 查询用户

> `GET` /users/url_token/:xxx

### 更新用户的 urlToken

> `PATCH` /users/:userId/url_token

BODY

```json
{
  "urlToken": "xxx"
}
```

### 更新用户头像

> `PATCH` /users/:userId/avatar

BODY

```json
{
  "file": "xxx",
  "x": "xxx",
  "y": "xxx",
  "width": "xxx",
  "height": "xxx"
}
```

### 删除用户

> `POST` /users

### 用户注册

> `POST` /users/signup

BODY

```json
{
  "email": "xxx",
  "password": "xxx",
  "nickname": "xxx"
}
```

### 用户登录

> `POST` /users/signin

BODY

```json
{
  "email": "xxx",
  "password": "xxx"
}
```

### 更新用户基本信息

> `PATCH` /users/:userId/profile

BODY

```json
{
  "name": "xxx",
  "birthday": "xxx",
  "cellphone": "xxx",
  "location": "xxx",
  "skills": "xxx",
  "gender": "xxx",
  "website": "xxx",
  "bio": "xxx"
}
```

### 更新用户密码

> `PATCH` /users/:userId/password

BODY

```json
{
  "password": "xxx",
  "newPassword": "xxx"
}
```

### 更新用户头像

## 问题

## 回复

## 投票

## 标签

## 公共

