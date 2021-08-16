const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');

dotenv.config();

const app = express();
const db = require("./models");
const passportConfig = require('./passport');

//middlewares
app.use('/', express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    domain: process.env.NODE_ENv === "production" && '.nodebird.com'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

db.sequelize.sync().then(()=>{
  console.log("db연결 성공")
}).catch(console.error);
passportConfig(); // 로그인 passport

if (process.env.NODE_ENV === "production") {
  // 배포모드일 때 로그가 자세해서 접속자의 아이피 등을 볼 수 있음 (ip 차단 가능)
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({
    origin: ['http://localhost:3060', 'https://api.nodebird.com'], // ==> 백엔드와 통신할 프론트 서버
    credentials: true,
  }));
} else {
  app.use(morgan("dev"));
  app.use(cors({
    origin: true,
    credentials: true,
  }));
}

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');

app.get('/', (req, res) => {
  res.send('hello express');
});

app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);


app.listen(80, () => {
  console.log("서버실행중", )
})
