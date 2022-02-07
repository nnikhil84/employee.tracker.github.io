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
function listDepartments() {
  let query = "SELECT * FROM  department";
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    listMenu();
  });
}

function listEmployees() {
  let query =
    "SELECT e.id, e.first_name, e.last_name, role.title, department.department_name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY id ASC";
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    listMenu();
  });
}

function listRoles() {
  let query = `SELECT role.id, role.title, department.department_name AS department, role.salary
                  FROM role
                  INNER JOIN department ON role.department_id = department.id`;
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    listMenu();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Enter the name of the new department!",
      },
    ])

    .then(function (response) {
      db.query(
        "INSERT INTO department SET ?",
        {
          department_name: response.department,
        },
        function (err) {
          if (err) throw err;
          console.log("The department was created successfully!");
          listMenu();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Enter the title of new role!",
      },
      {
        name: "salary",
        type: "input",
        message: "Enter the salary of the new role!",
      },
      {
        name: "department",
        type: "input",
        message: "Enter the department ID of the new role!",
      },
    ])

    .then(function (response) {
      db.query(
        "INSERT INTO role SET ?",
        {
          title: response.title,
          salary: response.salary,
          department_id: response.department,
        },
        function (err) {
          if (err) throw err;
          console.log("The new role is created successfully!");
          listMenu();
        }
      );
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter the first name of the new employee!",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter the last name of the new employee!",
      },
      {
        name: "employeeRole",
        type: "input",
        message: "Enter the role id for the new employee!",
      },
      {
        name: "employeeManager",
        type: "input",
        message: "Enter the id of the new employee's manager!",
      },
    ])

    .then(function (response) {
      db.query(
        "INSERT INTO employee SET ?",
        {
          first_name: response.firstName,
          last_name: response.lastName,
          role_id: response.employeeRole,
          manager_id: response.employeeManager,
        },
        function (err) {
          if (err) throw err;
          console.log("The new employee is created successfully!");
          listMenu();
        }
      );
    });
}

