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

function updateEmployeeRole() {
  let employeeArr = [];
  let roleArr = [];
  mysqlpromise
    .connectDb(dbConnect)
    .then((conn) => {
      return Promise.all([
        conn.query("SELECT id, title FROM role ORDER BY title ASC"),
        conn.query(
          "SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC"
        ),
      ]);
    })
    .then(([roles, employees]) => {
      for (i = 0; i < roles[0].length; i++) {
        roleArr.push(roles[0][i].title);
      }
      for (i = 0; i < employees[0].length; i++) {
        employeeArr.push(employees[0][i].Employee);
      }
      return Promise.all([roles[0], employees[0]]);
    })
    .then(([roles, employees]) => {
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Select employee to edit",
            choices: employeeArr,
          },
          {
            name: "role",
            type: "list",
            message: "Select new role pf the employee",
            choices: roleArr,
          },
        ])
        .then((answer) => {
          let roleID;
          let employeeID;
          for (i = 0; i < roles.length; i++) {
            if (answer.role == roles[i].title) {
              roleID = roles[i].id;
            }
          }
          for (i = 0; i < employees.length; i++) {
            if (answer.employee == employees[i].Employee) {
              employeeID = employees[i].id;
            }
          }
          db.query(
            `UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`,
            (err, res) => {
              if (err) return err;
              console.log(
                `\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n `
              );
              listMenu();
            }
          );
        });
    });
}

function deleteEmployee() {
  let employeeArr = [];

  db.query(
    "SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee ORDER BY Employee ASC",
    function (err, res) {
      for (i = 0; i < res.length; i++) {
        employeeArr.push(res[i].employee);
      }

      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Select employee to delete!",
            choices: employeeArr,
          },
          {
            name: "boolean",
            type: "list",
            message: "Please select to confirm deletion",
            choices: ["NO", "YES"],
          },
        ])
        .then((answer) => {
          if (answer.boolean == "YES") {
            let employeeID;

            for (i = 0; i < res.length; i++) {
              if (answer.employee == res[i].employee) {
                employeeID = res[i].id;
              }
            }

            db.query(
              `DELETE FROM employee WHERE id=${employeeID};`,
              (err, res) => {
                if (err) return err;
                console.log(`\n EMPLOYEE '${answer.employee}' DELETED...\n `);
                listMenu();
              }
            );
          } else {
            console.log(`\n EMPLOYEE '${answer.employee}' NOT DELETED...\n `);
            listMenu();
          }
        });
    }
  );
}

function deleteRole() {
  let roleArr = [];
  db.query("SELECT role.id, title FROM role", function (err, res) {
    for (i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

    inquirer
      .prompt([
        {
          name: "deletePrompt",
          type: "list",
          message:
            "------!!!!!! Deleting role will delete all employees associated with the role. Do you want to continue? !!!!!------",
          choices: ["NO", "YES"],
        },
      ])
      .then((answer) => {
        if (answer.deletePrompt === "NO") {
          listMenu();
        }
      })
      .then(() => {
        inquirer
          .prompt([
            {
              name: "role",
              type: "list",
              message: "Select the role to delete!",
              choices: roleArr,
            },
            {
              name: "deleteConfirmatiom",
              type: "Input",
              message: "Type the role to confirm deletion!",
            },
          ])
          .then((answer) => {
            if (answer.deleteConfirmation === answer.role) {
              let roleID;
              for (i = 0; i < res.length; i++) {
                if (answer.role == res[i].title) {
                  roleID = res[i].id;
                }
              }
              db.query(`DELETE FROM role WHERE id=${roleID};`, (err, res) => {
                if (err) return err;
                console.log(`\n ROLE '${answer.role}' is deleted!\n `);
                listMenu();
              });
            } else {
              console.log(`\n ROLE '${answer.role}' could not be deleted!\n `);
              listMenu();
            }
          });
      });
  });
}

function deleteDepartment() {
  let deptArr = [];

  db.query("SELECT id, department_name FROM department", function (err, depts) {
    for (i = 0; i < depts.length; i++) {
      deptArr.push(depts[i].department_name);
    }

    inquirer
      .prompt([
        {
          name: "deletePrompt",
          type: "list",
          message:
            "------!!!!!! Deleting a department will delete all employees associated with the department. Do you want to continue? !!!!!------",
          choices: ["NO", "YES"],
        },
      ])
      .then((answer) => {
        if (answer.deletePrompt === "NO") {
          listMenu();
        }
      })
      .then(() => {
        inquirer
          .prompt([
            {
              name: "dept",
              type: "list",
              message: "Enter the department to be deleted!",
              choices: deptArr,
            },
            {
              name: "deleteConfirmation",
              type: "Input",
              message: "Type the role to confirm deletion!",
            },
          ])
          .then((answer) => {
            if (answer.confirmDelete === answer.dept) {
              let deptID;
              for (i = 0; i < depts.length; i++) {
                if (answer.dept == depts[i].department_name) {
                  deptID = depts[i].id;
                }
              }
              db.query(
                `DELETE FROM department WHERE id=${deptID};`,
                (err, res) => {
                  if (err) return err;
                  console.log(`\n DEPARTMENT '${answer.dept}' is deleted!\n `);
                  listMenu();
                }
              );
            } else {
              console.log(
                `\n DEPARTMENT '${answer.dept}' could not be deleted!\n `
              );
              listMenu();
            }
          });
      });
  });
}