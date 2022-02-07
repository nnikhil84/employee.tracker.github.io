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

function listMenu() {
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "Please select relevant option from below!",
        choices: [
          "List all departments",
          "List all employees",
          "List all roles",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update employee role",
          "Delete employee",
          "Delete role",
          "Delete department",
          "Exit",
        ],
      },
    ])

    .then(function (input) {
      if (input.action === "List all departments") {
        listDepartments();
      } else if (input.action === "List all employees") {
        listEmployees();
      } else if (input.action === "List all roles") {
        listRoles();
      } else if (input.action === "Add a department") {
        addDepartment();
      } else if (input.action === "Add a role") {
        addRole();
      } else if (input.action === "Add an employee") {
        addEmployee();
      } else if (input.action === "Update employee role") {
        updateEmployeeRole();
      } else if (input.action === "Delete employee") {
        deleteEmployee();
      } else if (input.action === "Delete role") {
        deleteRole();
      } else if (input.action === "Delete department") {
        deleteDepartment();
      } else if (input.action === "Exit") {
        console.log("Exiting the Employee Management System");
        db.end();
        return;
      }
    });
}