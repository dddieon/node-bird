const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email', // 로그인필드 타입
    passwordField: 'password',
  }, async (email, password, done) => {
    // 비동기 + await 요청은 항상 서버에러를 위한 try catch
    try {
      const user = await User.findOne({
        // 로그인전략 1 -- 아이디 존재여부
        where: {email: email}
      })
      if (!user) {
        return done(null, false, {reason: "존재하지 않는 사용자입니다"}) //passport는 응답res가 아닌 done
      }
      // 로그인전략 2 -- 패스워드 해독
      const result = await bcrypt.compare(password, User.password);
      if (result) {
        return done(null, user); // 성공
      }
      return done(null, false, {reason: "비밀번호가 틀렸습니다"});

    }  catch (error) {
      console.error(error)
    }
    return done(error)
  }));
}