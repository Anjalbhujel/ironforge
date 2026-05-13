const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gym_products'
});

db.connect((err) => {
    if(err){
        console.log('Db connection failed:', err);
    } else {
        console.log('MySQL connected');
    }
});

module.exports = db;