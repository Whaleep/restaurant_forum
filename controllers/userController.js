const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  // 註冊頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  // 註冊操作
  signUp: (req, res) => {
    // confirm password 兩次輸入的密碼要相同
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user 信箱不能重複
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱重複！')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/signin')
            })
          }
        })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
