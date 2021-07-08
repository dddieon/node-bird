const express = require('express');
const app = express();

const postRouter = require('./routes/post');

app.use("post", postRouter);

app.listen(3065, () => {
  console.log("서버실행중")
})