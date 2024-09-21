import inquirer from 'inquirer';
import { db } from './db'; //Imports the db connection


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
        choices
       } 
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
          process.exit();
    }
    mainMenu();
}

async function viewDepartments() {
  const [rows] = await db.query('SELECT * FROM departments');
  console.log('Departments');
  rows.forEach((dept: { id: number; name: string;}) => {
    console.log(`ID: ${dept.id}, Name: ${dept.name}`);
  });
}

async function viewRoles() {
  const query = `
      SELECT roles.id, roles.title, roles.salary, departments.name AS department
      FROM roles
      JOIN departments ON roles.department_id = departments.id
  `;
  const [rows] = await db.query(query);
  console.log('Roles:');
  rows.forEach((role: { id: number; title: string; salary: number; department: string;}) => {
    console.log(`ID: ${role.id}, Title: ${role.title}, Salary: $${role.salary}, Department: ${role.department}`);
  });
}

async function viewEmployees() { 
  const query =  `
      SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role, departments.name AS department,
             CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
      FROM employees
      JOIN roles ON employees.role_id = roles.id
      JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees manager ON employees.manager_id = manager.id
  `; 
  const [rows] = await db.query(query);
  console.log('Employees:');
  rows.forEach((emp: { id: number; first_name: string; last_name: string; role: string; department: string; manager: string; }) => {
      console.log(`ID: ${emp.id}, Name: ${emp.first_name} ${emp.last_name}, Role: ${emp.role}, Department: ${emp.department}, Manager: ${emp.manager || 'None'}`);
  });
}
