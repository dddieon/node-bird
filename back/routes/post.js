const express = require('express');

const router = express.Router();
const {Post, Image, Comment, User} = require('../models');
const {isLoggedIn} = require('./middlewares');

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
        model: Comment, // !! 게시글에 달린 댓글 !!
        include:[{
          model: User,
          attributes: ['id', 'nickname'],
        }]
      }, {
        model: User, // !! 게시글 작성자 !!
        attributes: ['id', 'nickname'],
      }, {
        model: User,  // !! 게시글 좋아요한 사람!!
        as: 'Likers',
        attributes: ['id']
      }]
    })
    res.status(201).json(fullPost);
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
      PostId: parseInt(req.params.postId), // ＃ params 로 파라미터 접근
      UserId: req.user.id, // ★ passport.js - 디시리얼라이즈 기능
    })
    const fullComment = await Comment.findOne({
      where: {id: comment.id},
      include:[{
        model: User,
        attributes: ['id', 'nickname'],
      }]
    })
    res.status(201).json(fullComment);
  } catch(error) {
    console.error(error);
    next(error);
  }
})

router.patch(`/:postId/like`, async (req, res, next) => {
  // 좋아요는 항상 게시글존재유무 체크
  try {
    const post = await Post.findOne({ // await를 쓰지 않으면 500에러가 뜹니다...
      where: {
        id: req.params.postId
      }
    });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.delete(`/:postId/unlike`, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId }});
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.delete("/:postId", async (req,res) => { //DELETE /post/1
  try {
    await Post.destroy({ // 시퀄라이저 기능
      where: {id: req.params.postId}
    });
    res.json({ PostId : req.params.postId });
  } catch (error) {
    console.error(error);
    next(error);
  }
})

module.exports = router;