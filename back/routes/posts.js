const express = require('express');

const {Post, User, Image, Comment} = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ], // 최신 게시글부터
      include: [{
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      },{
        model: User, // 글 작성자
        attributes: ['id', 'nickname'],
      }, {
        model: Image
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }]
      }, {
        model: User, //좋아요 누른 사람
        as: 'Likers',
        attributes: ['id']
      }]
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
})

module.exports = router;