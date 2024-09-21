import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'company_db'
});

export { db };