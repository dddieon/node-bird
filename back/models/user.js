module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',{ //users 테이블로 저장됨
    // id는 자동으로 삽입될 예정
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    // 모델에 대한 설정들...
    charset: 'utf8',
    collate: 'utf8_general_ci', //한글사용 가능
  });
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, {through: "Like", as: "Liked"}); // 좋아한 게시물들
    db.User.belongsToMany(db.User, {through: "Follow", as: "Followers", foreignKey: "FollowingId"}); // 나의 팔로워들
    db.User.belongsToMany(db.User, {through: "Follow", as: "Followings", foreignKey: "FollowerId"}); // 나의 팔로잉목록들
  };
  return User;
}