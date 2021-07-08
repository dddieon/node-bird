module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',{ //users 테이블로 저장됨
    // id는 자동으로 삽입될 예정
    email: {
      type: DataTypes.String(30),
      allowNull: false,
      unique: true,
    },
    nickname: {
      type: DataTypes.String(30),
      allowNull: false,
    },
    password: {
      type: DataTypes.String(100),
      allowNull: false,
    },
  }, {
    // 모델에 대한 설정들...
    charset: 'utf8',
    collate: 'utf8_general_ci', //한글사용 가능
  });
  User.associate = (db) => {
  };
  return User;
}