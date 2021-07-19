const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  passport.serializeUser((user, done) => { // 토큰발급
    done(null, user.id); // 1:에러 2:성공
  });

  passport.deserializeUser(async(id, done) => { // 토큰확인
    try {
      const user = await User.findOne({where: {id}});
      done(null, user) // 1:에러 2:성공
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
}