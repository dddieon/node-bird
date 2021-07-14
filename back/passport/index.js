const passport = require('passport');
const local = require('./local');

module.exports = () => {
  passport.serializeUser(() => { // 설정1

  });

  passport.deserializeUser(() => { // 설정2

  });

  local();
}