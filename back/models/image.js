module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("Image",{
    // id는 자동으로 저장
    name: {
      type: DataTypes.String(200),
      allowNull: false,
    },
  }, {
    charset: "utf8",
    collate: "utf8",
  });
  Image.associate = (db) => {
    db.Image.belongsTo(db.Post);
  };
  return Image;
}