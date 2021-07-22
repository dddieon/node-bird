const express = require('express');

const {Post, User, Image, Comment} = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        ['Comment', 'createdAt', 'DESC'],
      ], // 최신 게시글부터
      include: [{
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
      }]
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
})

module.exports = router;