const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const app = express();
const db = require("./models");
const passportConfig = require('./passport');

//middlewares
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:3060', // ==> 백엔드와 통신할 프론트 서버
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());

db.sequelize.sync().then(()=>{
  console.log("db연결 성공")
}).catch(console.error);
passportConfig(); // 로그인 passport

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');

app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);


app.listen(3065, () => {
  console.log("서버실행중", )
})