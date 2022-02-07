INSERT INTO department(department_name)
VALUES
("Management"),
("Marketing"),
("Engineering"),
("Finance"),
("HR");

INSERT INTO role (title, salary, department_id)
VALUES
("Operations Manager", 100000, 1),
("Office Manager", 100000, 1),
("CEO", 3000000, 1),
("Marketing Manager", 90000, 2),
("Marketing Assistant", 40000, 2),
("Engineering Manager", 120000, 3),
("Software Engineering Lead", 150000, 3),
("Senior Engineer", 100000, 3),
("Junior Engineer", 50000, 3),
("Finance Manager", 130000, 4),
("Accountant", 70000, 4),
("HR Manager", 90000, 5),
("HR Rep", 40000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Carolynn", "Colvin", 13, 2),
("JJ", "Shiers", 12, 5),
("Andy", "Mondello", 11, 4),
("Sandra", "Lincs", 10, 5),
("Joel", "Zhou", 5, 8),
("Mohsen", "Ghomashchi", 5, 8),
("Nikhil", "N", 3, null),
("Amandeep", "Kaleka", 4, 7),
("Elaine", "Morrison", 9, 7),
("Raymond", "Hernandes", 8, 7),
("Kevin", "Ganton", 7, 6),
("Elizabeth", "Manio", 5, 13),
("Alison", "Bailey", 4, 5),
("Adam", "Paul", 1, 5),
("Jackie", "Ruccio", 2, 5) 