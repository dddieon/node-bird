const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "localhost",
    "dialect": "mysql",
    "port": "3305"
  },
  "test": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "localhost",
    "dialect": "mysql",
    "port": "3305"
  },
  "production": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "localhost",
    "dialect": "mysql",
    "port": "3305"
  }
}
