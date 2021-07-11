const express = require('express');
const cors = require('cors');
const app = express();
const db = require("./models");
const bcrypt = require('bcrypt');
const { User } = require('./models');

//middlewares
app.use(cors({
  origin: '*',
  credentials: false,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

db.sequelize.sync().then(()=>{
  console.log("db연결 성공")
}).catch(console.error)

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

app.use("/post", postRouter);
app.use("/user", userRouter);


app.listen(3065, () => {
  console.log("서버실행중", )
})