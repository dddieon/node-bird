const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const app = express();
const db = require("./models");
const passportConfig = require('./passport');

//middlewares
app.use(cors({
  origin: '*',
  credentials: false,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: "nodebirdsecret"
}));
app.use(passport.initialize());
app.use(passport.session());

db.sequelize.sync().then(()=>{
  console.log("db연결 성공")
}).catch(console.error);
passportConfig(); // 로그인 passport

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

app.use("/post", postRouter);
app.use("/user", userRouter);


app.listen(3065, () => {
  console.log("서버실행중", )
})