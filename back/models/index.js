'use strict';
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env]; //config.json에서 설정가져옴

const sequelize = new Sequelize(config.database, config.username, config.password, config); // 노드 - mysql 연결

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
