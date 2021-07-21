const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const db = require('../models');

const router = express.Router();

router.get("/", async (req,res) => { // loadMyInfo
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: {id: req.user.id},
        attributes: {
          exclude: ['password'] // --- 패스워드 컬럼 제외
        },
        include: [{
          model: Post, // --- associate 되었던 테이블에서 id만 조인: 숫자만 세기
          attributes: ['id'],
        }, {
          model: User,
          attributes: ['id'],
          as: 'Followings' // --- as는 모델정의와 동일하게
        }, {
          model: User,
          attributes: ['id'],
          as: 'Followers'
        }]
      })
      res.status(200).json(fullUserWithoutPassword); // 프론트에 유저정보를 보낸다
    } else {
      res.status(200).json(null);
    }
  } catch(e) {
    console.error(e);
    next(e);
  }
})

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { // 1. 에러
      next(err);
    }
    if (info) { // 2. 요청/응답의 정보
      return res.status(401).send(info.reason);
    }
    return req.login(user, async(loginErr) => {
      if (loginErr) { // 3. 패스포트 모듈에서 에러날 때
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: {id: user.id},
        attributes: {
          exclude: ['password'] // --- 패스워드 컬럼 제외
        },
        include: [{
          model: Post, // --- associate 되었던 테이블에서 조인
          attributes: ['id'],
        }, {
          model: User,
          attributes: ['id'],
          as: 'Followings' // --- as는 모델정의와 동일하게
        }, {
          model: User,
          attributes: ['id'],
          as: 'Followers'
        }]
      })
      return res.status(200).json(fullUserWithoutPassword); // 4. 사용자 정보를 프론트로
    })
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send("logout ok");
});

router.post("/", isNotLoggedIn, async (req,res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
    if (exUser) {
      return res.status(403).send('이미 사용 중인 아이디입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
});

module.exports = router;