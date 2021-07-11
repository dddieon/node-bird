const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env]; //config.json에서 설정가져옴
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config); // 노드 - mysql 연결

db.User = require("./user")(sequelize, Sequelize);
db.Hashtag = require("./hashtag")(sequelize, Sequelize);
db.Image = require("./image")(sequelize, Sequelize);
db.Post = require("./post")(sequelize, Sequelize);
db.Comment = require("./comment")(sequelize, Sequelize);

Object.keys(db).forEach(modelName => { // 관계 형성
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
