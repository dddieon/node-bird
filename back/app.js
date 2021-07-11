const express = require('express');
const app = express();
const db = require("./models");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

db.sequelize.sync().then(()=>{
  console.log("db연결 성공")
}).catch(console.error)

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

app.use("post", postRouter);
app.use("user", userRouter);

app.listen(3065, () => {
  console.log("서버실행중")
})