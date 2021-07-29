const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {Post, Image, Comment, User} = require('../models');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log("uploads 폴더를 새로 생성합니다");
  fs.mkdirSync("uploads");
}


// ==== 이미지 업로드용 ====
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) { // file_name.png
      const ext = path.extname(file.originalname); // = .png
      const basename = path.basename(file.originalname, ext) // = file_name 을 추출
      done(null, basename  + '_' + new Date().getTime() + ext ); // file_name1847578... .png
    },
  }), // 저장위치 설정
  limits: {fileSize: 20 * 1024 * 1024} // 20mb
})

router.post("/", isLoggedIn, upload.none() , async (req,res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id, // ★ passport.js - 디시리얼라이즈 기능
    })
    if (req.body.image) {
      if (Array.isArray(req.body.image)) { // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png]
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.addImages(images);
      } else { // 이미지를 하나만 올리면 image: 제로초.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    // if (req.body.image) {
    //   if(Array.isArray(req.body.image)) { //이미지가 여러개면 배열, 아니면 스트링
    //     const images = await Promise.all(req.body.image.map((image) => Image.create({src: image})));
    //     await post.addImages(images);
    //   } else {
    //     const image = await Image.create({src: req.body.image});
    //     await post.addImages(image);
    //   }
    // }
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

router.post(`/:postId/comment`, isLoggedIn, async (req,res, next) => {
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

router.patch(`/:postId/like`, isLoggedIn, async (req, res, next) => {
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

router.delete(`/:postId/unlike`, isLoggedIn, async (req, res, next) => {
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

router.delete("/:postId", isLoggedIn, async (req,res, next) => { //DELETE /post/1
  try {
    await Post.destroy({ // 시퀄라이저 기능
      where: {
        id: req.params.postId,
        UserId: req.user.id // 본인 게시글만 삭제가능한 필터
      }
    });
    res.status(200).json({PostId: parseInt(req.params.postId, 10)});
    res.json({ PostId : req.params.postId });
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.post("/images", isLoggedIn, upload.array('image') , async (req,res, next) => { // POST /post/images
  console.log(req.files);
  res.json(req.files.map(v => v.filename));
})

module.exports = router;