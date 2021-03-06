const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, Post, Image, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const db = require('../models');
const {Op} = require("sequelize");

const router = express.Router();

router.get("/", async (req,res, next) => { // loadMyInfo
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

//  ==== 회원가입 ====
router.post("/", isNotLoggedIn, async (req,res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
    if (exUser) {
      return res.status(403).json('이미 사용 중인 아이디입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).json('ok');
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
});

//  ==== 닉네임 변경 ====
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
  await User.update({
    nickname: req.body.nickname,
  }, {
    where: { id: req.user.id }
  })
    res.status(200).json({
      nickname: req.body.nickname,
    })
  } catch (error) {
    console.error(error);
    next(error);
  }
});


//  ==== 내팔로워 조회 ====
router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    // 유저존재 확인
    const user = await User.findOne({
      where: {id: req.user.id}
    })
    if (!user) {
      res.status(403).send("유저정보가 없음");
    }
    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//  ==== 팔로잉하고 있는 사람 조회 ====
router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    // 유저존재 확인
    const user = await User.findOne({
      where: {id: req.user.id}
    })
    if (!user) {
      res.status(403).send("유저정보가 없음");
    }
    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//  ==== 내 팔로워 차단 ====
router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  try {
    // 유저존재 확인
    const user = await User.findOne({
      where: {id: req.params.userId}
    })
    if (!user) {
      res.status(403).send("차단할 유저가 존재하지 않음"); // 해당 followings <-> 유저의 followers (대칭)
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({UserId: parseInt(req.params.userId, 10)});
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//  ==== 팔로우 ====
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    // 유저존재 확인
    const user = await User.findOne({
      where: {id: req.params.userId}
    })
    if (!user) {
      res.status(403).send("없는 사람을 팔로우하고 있습니다.");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({
      UserId: parseInt(req.params.userId, 10)
    })
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//  ==== 언팔로우 ====
router.delete("/:userId/unfollow", isLoggedIn, async (req, res, next) => {
  try {
    // 유저존재 확인
    const user = await User.findOne({
      where: {id: req.params.userId}
    })
    if (!user) {
      res.status(403).send("없는 사람을 언팔로우하고 있습니다.");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({
      UserId: parseInt(req.params.userId, 10)
    })
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// ==== 타인의 유저 정보 =====
router.get("/:userId", isLoggedIn, async (req, res, next) => {
  try {
    // 유저존재 확인
    const fullUserWithoutPassword = await User.findOne({
      where: {id: req.params.userId},
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
    if (!fullUserWithoutPassword) {
      return res.status(403).send("유저가 존재하지 않음"); // 해당 followings <-> 유저의 followers (대칭)
    }
    const data = fullUserWithoutPassword.toJSON();
    data.Posts = data.Posts.length;
    data.Followers = data.Followers.length;
    data.Followings = data.Followings.length; // 개인정보이기에 개수만 보냄
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// ===== 타인의 게시글 ===== // :id이기 때문에 맨 뒤에 다른 라우터와 착각 -> 404 에러 -> 맨마지막에 !!!

router.get('/:id/posts', async (req, res, next) => { // GET /user/1/posts
  try {
    const user = await User.findOne({ where: { id: req.params.id }});
    if (user) {
      const where = {};
      if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
        where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
      } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
      const posts = await user.getPosts({
        where,
        limit: 10,
        include: [{
          model: Image,
        }, {
          model: Comment,
          include: [{
            model: User,
            attributes: ['id', 'nickname'],
          }]
        }, {
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: User,
          through: 'Like',
          as: 'Likers',
          attributes: ['id'],
        }, {
          model: Post,
          as: 'Retweet',
          include: [{
            model: User,
            attributes: ['id', 'nickname'],
          }, {
            model: Image,
          }]
        }],
      });
      console.log(posts);
      res.status(200).json(posts);
    } else {
      res.status(404).send('존재하지 않는 사용자입니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;