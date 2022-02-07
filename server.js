const inquirer = require("inquirer");
const mysql = require("mysql2");
const mysqlpromise = require("mysql2/promise");
const { dbConnect, db } = require("./config/connection");

// To establish connection with database
db.connect((err) => {
  if (err) throw err;
  console.log("Connection Estabilished");
  listMenu();
});
