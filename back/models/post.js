module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post',{
    // id는 자동으로 저장
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',  //이모티콘까지 가능
  });
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // 게시글 작성자 only || 생성: post.addUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, {through: "PostHashtag"}); // 생성: post.addHashtags
    db.Post.hasMany(db.Comment); // 생성: post.addComments, post.getComments
    db.Post.hasMany(db.Image); // 생성: post.addImages
    db.Post.belongsToMany(db.Post, {through: "RetweetTable", as: "Retweet"}); // 생성: post.addRetweet
    db.Post.belongsToMany(db.User, {through: "Like", as: 'Likers'}); // 생성: post.addLikers + post.removeLikers
  };
  return Post;
}