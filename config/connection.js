const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const dbConnect = {
  host: "localhost",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
};

const db = mysql.createConnection(dbConnect);

module.exports = {
  dbConnect,
  db,
};
