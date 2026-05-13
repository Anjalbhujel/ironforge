
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

app.get('/test' , (req, res) => {
res.json({ message: 'Backend is working!' });
});

app.get('/products', (req,res) => {
const sql = 'SELECT * FROM products';

db.query(sql, (err, result) => {
    if(err){
        console.log(err);
        return res.status(500).json({error : 'Database Error'});
    }
    res.json(result);
});
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});