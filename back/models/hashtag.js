module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define("Hashtag",{
    // id는 자동으로 저장
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  }, {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",  //이모티콘까지 가능
  });
  Hashtag.associate = (db) => {
    db.Hashtag.belongsToMany(db.Post, {through: "PostHashtag"});
  };
  return Hashtag;
}