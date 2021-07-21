const express = require('express');

const router = express.Router();
const {Post, Image, Comment, User} = require('../models');
const {isLoggedIn} = require('./middlewares');

router.get("/", (req,res) => {
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' }
  ])
})

router.post("/", isLoggedIn, async (req,res) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id, // ★ passport.js - 디시리얼라이즈 기능
    })
    const fullPost = await Post.findOne({ // !! 테이블 조인 !!
      where: { id: post.id },
      include: [{
        model: Image, // !! 게시글에 달린 이미지 !!
      }, {
        model: Comment // !! 게시글에 달린 댓글 !!
      }, {
        model: User, // !! 게시글 작성자 !!
      }]
    })
    res.status(201).json(post);
  } catch(error) {
    console.error(error);
    next(error);
  }
})

router.post(`/:postId/comment`, isLoggedIn, async (req,res) => {
  try {
    const isPost = await Post.findOne({
      where: {id: req.params.postId}
    })
    if (!isPost) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId, // ＃ params 로 파라미터 접근
      UserId: req.user.id, // ★ passport.js - 디시리얼라이즈 기능
    })
    res.status(201).json(comment);
  } catch(error) {
    console.error(error);
    next(error);
  }
})

router.delete("/", (req,res) => { //DELETE /post
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' }
  ])
})

module.exports = router;