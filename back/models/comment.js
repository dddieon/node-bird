module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment',{
    // id는 자동으로 저장
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',  //이모티콘까지 가능
  });
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User)
    db.Comment.belongsTo(db.Post)
  };
  return Comment;
}