module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("Image",{
    // id는 자동으로 저장
    src: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  }, {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",  //이모티콘까지 가능
  });
  Image.associate = (db) => {
    db.Image.belongsTo(db.Post);
  };
  return Image;
}