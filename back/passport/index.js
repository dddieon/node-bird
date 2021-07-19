const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  passport.serializeUser((user, done) => { // 로그인 가장 마지막 실행 --- 토큰발급
    done(null, user.id); // 1:에러 2:성공
  });

  passport.deserializeUser(async(id, done) => { // id로 사용자정보 복구 --- 토큰사용
    try {
      const user = await User.findOne({where: {id}});
      done(null, user) // 1:에러 2:성공 -> req.user는 매번 정보를 가짐
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
}