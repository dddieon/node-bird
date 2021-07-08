module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post',{
    // id는 자동으로 저장
    content: {
      type: DataTypes.Text,
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',  //이모티콘까지 가능
  });
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // 게시글 작성자 only
    db.Post.belongsToMany(db.Hashtag);
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.Post, {as: "Retweet"}); // 리트윗 = 1:多 -> postId는 Retweet으로 변한다
    db.Post.belongsToMany(db.User, {through: "Like", as: 'Likers'}); // 좋아요는 여러 게시글에 여려사용자 가능
  };
  return Post;
}