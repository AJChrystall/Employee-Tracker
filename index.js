const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;

// Connect to database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'books_db',
});

// Main menu prompt
async function promptMainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
          {
            name: 'View All Employees',
            value: 'VIEW_EMPLOYEES',
          },
          {
            name: 'Add Employee',
            value: 'ADD_EMPLOYEE',
          },
          
          {
            name: 'View All Roles',
            value: 'VIEW_ROLES',
          },
          {
            name: 'Update Employee Role',
            value: 'UPDATE_EMPLOYEE_ROLE',
          },
          {
            name: 'Add Role',
            value: 'ADD_ROLE',
          },
          {
            name: 'View All Departments',
            value: 'VIEW_DEPARTMENTS',
          },
          {
            name: 'Add Department',
            value: 'ADD_DEPARTMENT',
          }, 
        ],
      },
    ])
    .then((res) => {
      let choice = res.choice;
      // Call the appropriate function depending on what the user chose
      switch (choice) {
        case 'VIEW_EMPLOYEES':
          viewEmployees();
          break;
        case 'ADD_EMPLOYEE':
          addEmployee();
          break;
        case 'UPDATE_EMPLOYEE_ROLE':
          updateEmployeeRole();
          break;
        case 'ADD_ROLE':
          addRole();
          break;
        case 'VIEW_ROLES':
          viewRoles();
          break;
        case 'VIEW_DEPARTMENTS':
            viewDepartments();
          break;
        case 'ADD_DEPARTMENT':
          addDepartment();
          break;
        default:
          quit();
      }
    });
}

// View Employees
async function viewEmployees() {
  try {
    const [rows] = await db.promise().query('SELECT * FROM employee');
    console.log('--------------');
    rows.forEach((employee) => {
      console.log(`ID: ${employee.id}`);
      console.log(`First Name: ${employee.first_name}`);
      console.log(`Last Name: ${employee.last_name}`);
      console.log(`Role ID: ${employee.role_id}`);
      console.log(`Manager ID: ${employee.manager_id}`);
      console.log('--------------');
    });
    promptMainMenu();
  } catch (error) {
    console.error('An error occurred while fetching employees:', error);
    promptMainMenu();
  }
}

// Add Employee
async function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "Enter the employee's first name:",
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Enter the employee's last name:",
      },
      {
        type: 'input',
        name: 'role_id',
        message: "Enter the employee's role ID:",
      },
    ])
    .then(async (answers) => {
      try {
// Insert the new employee into the database
        const [result] = await db
          .promise()
          .query('INSERT INTO employee SET ?', answers);
        console.log('Employee added successfully!');
        console.log(`New employee ID: ${result.insertId}`);
        promptMainMenu();
      } catch (error) {
        console.error('An error occurred while adding the employee:', error);
        promptMainMenu();
      }
    });
}

// View All Roles
async function viewRoles() {
  try {
    const [rows] = await db.promise().query('SELECT * FROM role');
    console.log('--------------');
    rows.forEach((role) => {
      console.log(`ID: ${role.id}`);
      console.log(`Title: ${role.title}`);
      console.log(`Salary: ${role.salary}`);
      console.log(`Department ID: ${role.department_id}`);
      console.log('--------------');
    });
    promptMainMenu();
  } catch (error) {
    console.error('An error occurred while fetching roles:', error);
    promptMainMenu();
  }
}

// Add Role
async function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: "Enter the role's title:",
      },
      {
        type: 'input',
        name: 'salary',
        message: "Enter the role's salary:",
      },
      {
        type: 'input',
        name: 'department_id',
        message: "Enter the role's department ID:",
      },
    ])
    .then(async (answers) => {
      try {
        // Insert the new role into the database
        const [result] = await db
          .promise()
          .query('INSERT INTO role SET ?', answers);
        console.log('Role added successfully!');
        console.log(`New role ID: ${result.insertId}`);
        promptMainMenu();
      } catch (error) {
        console.error('An error occurred while adding the role:', error);
        promptMainMenu();
      }
    });
}

// Update Employee Role
async function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'employee_id',
        message: "Enter the employee's ID:",
      },
      {
        type: 'input',
        name: 'role_id',
        message: "Enter the new role ID:",
      },
    ])
    .then(async (answers) => {
      try {
// Update the employee's role in the database
const [result] = await db
      .promise()
      .query('UPDATE employee SET role_id = ? WHERE id = ?', [
        answers.role_id,
        answers.employee_id,
      ]);
    console.log('Employee role updated successfully!');
    promptMainMenu();
  } catch (error) {
    console.error('An error occurred while updating the employee role:', error);
    promptMainMenu();
  }
})
.catch((error) => {
  console.error('An error occurred:', error);
  promptMainMenu();
});
}

// View All Departments
async function viewDepartments() {
  try {
    const [rows] = await db.promise().query('SELECT * FROM department');
    console.log('--------------');
    rows.forEach((department) => {
      console.log(`ID: ${department.id}`);
      console.log(`Name: ${department.name}`);
      console.log('--------------');
    });
    promptMainMenu();
  } catch (error) {
    console.error('An error occurred while fetching departments:', error);
    promptMainMenu();
  }
}

// Add Department
async function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: "Enter the department's name:",
      },
    ])
    .then(async (answers) => {
      try {
        // Insert the new department into the database
        const [result] = await db
          .promise()
          .query('INSERT INTO department SET ?', answers);
        console.log('Department added successfully!');
        console.log(`New department ID: ${result.insertId}`);
        promptMainMenu();
      } catch (error) {
        console.error('An error occurred while adding the department:', error);
        promptMainMenu();
      }
    });
}

// Start the application
db.connect((error) => {
if (error) {
console.error('Error connecting to the database:', error);
return;
}
console.log('Connected to the books_db database.');
promptMainMenu();
});