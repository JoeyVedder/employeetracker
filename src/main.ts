import inquirer from 'inquirer';
import { Pool } from 'pg';

const db = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'company_db',
  password: 'your_password',
  port: 5432, // default port for PostgreSQL
});


async function mainMenu() {
  const choices = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role',
    'Add an employee',
    'Update an employee role',
    'Exit',
  ];

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices,
    },
  ]);

  switch (action) {
    case 'View all departments':
      await viewDepartments();
      break;
    case 'View all roles':
      await viewRoles();
      break;
    case 'View all employees':
      await viewEmployees();
      break;
    case 'Add a department':
      await addDepartment();
      break;
    case 'Add a role':
      await addRole();
      break;
    case 'Add an employee':
      await addEmployee();
      break;
    case 'Update an employee role':
      await updateEmployeeRole();
      break;
    case 'Exit':
      db.end(); // Close the PostgreSQL connection pool
      process.exit();
  }
  mainMenu();
}

async function viewDepartments() {
  const { rows } = await db.query('SELECT * FROM departments');
  console.log('Departments:');
  rows.forEach((dept: { id: number; name: string }) => {
    console.log(`ID: ${dept.id}, Name: ${dept.name}`);
  });
}

async function viewRoles() {
  const query = `
    SELECT roles.id, roles.title, roles.salary, departments.name AS department
    FROM roles
    JOIN departments ON roles.department_id = departments.id
  `;
  const { rows } = await db.query(query);
  console.log('Roles:');
  rows.forEach((role: { id: number; title: string; salary: number; department: string }) => {
    console.log(`ID: ${role.id}, Title: ${role.title}, Salary: $${role.salary}, Department: ${role.department}`);
  });
}

async function viewEmployees() {
  const query = `
    SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role, departments.name AS department,
           CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id
  `;
  const { rows } = await db.query(query);
  console.log('Employees:');
  rows.forEach((emp: { id: number; first_name: string; last_name: string; role: string; department: string; manager: string }) => {
    console.log(`ID: ${emp.id}, Name: ${emp.first_name} ${emp.last_name}, Role: ${emp.role}, Department: ${emp.department}, Manager: ${emp.manager || 'None'}`);
  });
}

async function addDepartment() {
  const { name } = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter the department name:',
  });

  await db.query('INSERT INTO departments (name) VALUES ($1)', [name]);
  console.log(`Added department: ${name}`);
}

async function addRole() {
  const { rows: departments } = await db.query('SELECT * FROM departments');
  const { title, salary, department_id } = await inquirer.prompt([
    { type: 'input', name: 'title', message: 'Enter the role title:' },
    { type: 'input', name: 'salary', message: 'Enter the role salary:' },
    {
      type: 'list',
      name: 'department_id',
      message: 'Choose a department:',
      choices: departments.map((dept: { id: number; name: string }) => ({ name: dept.name, value: dept.id })), // Maps each department to an object with the department name and id for use in a prompt.
    },
  ]);

  await db.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
  console.log(`Added role: ${title}`);
}

async function addEmployee() {
  const { rows: roles } = await db.query('SELECT * FROM roles');
  const { rows: employees } = await db.query('SELECT * FROM employees');
  const { firstName, lastName, role_id, manager_id } = await inquirer.prompt([
    { type: 'input', name: 'firstName', message: 'Enter the employee’s first name:' },
    { type: 'input', name: 'lastName', message: 'Enter the employee’s last name:' },
    {
      type: 'list',
      name: 'role_id',
      message: 'Choose a role:',
      choices: roles.map((role: { id: number; title: string }) => ({ name: role.title, value: role.id })), // Maps each role to an object with the role title and id for use in a prompt.
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Choose a manager (or none):',
      choices: employees
        .map((emp: { id: number; first_name: string; last_name: string }) => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })) // Maps each employee to an object with their full name and id, then adds an option for "None" as a manager.
        .concat([{ name: 'None', value: null as unknown as number }]), // Adds "None" option for manager selection.
    },
  ]);

  await db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, role_id, manager_id]);
  console.log(`Added employee: ${firstName} ${lastName}`);
}

async function updateEmployeeRole() {
  const { rows: employees } = await db.query('SELECT * FROM employees');
  const { rows: roles } = await db.query('SELECT * FROM roles');
  const { employee_id, role_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Choose an employee to update:',
      choices: employees.map((emp: { id: number; first_name: string; last_name: string }) => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Choose a new role:',
      choices: roles.map((role: { id: number; title: string }) => ({ name: role.title, value: role.id })),
    },
  ]);

  await db.query('UPDATE employees SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
  console.log('Employee role updated!');
}

mainMenu();
