
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

app.get('/products', (req, res) => {
  const sql = `
    SELECT p.*, c.name AS category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database Error' });
    }
    res.json(result);
  });
});

app.get('/products/:id', (req, res) => {
  const sql = `
    SELECT p.*, c.name AS category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database Error' });
    if (result.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result[0]);
  });
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});