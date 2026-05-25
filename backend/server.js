
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

app.post('/api/orders', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not logged in' });

  const jwt = require('jsonwebtoken');
  let user;
  try {
    user = jwt.verify(token, 'ironstore_secret_key');
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const { shipping_address, payment_method, items } = req.body;

  if (!items || items.length === 0)
    return res.status(400).json({ message: 'No items in order' });

  const total_amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderSql = `
    INSERT INTO orders 
    (user_id, total_amount, status, shipping_address, payment_method, payment_status, order_status, delivery_address)
    VALUES (?, ?, 'pending', ?, ?, 'pending', 'processing', ?)
  `;

  db.query(orderSql, [user.id, total_amount, shipping_address, payment_method, shipping_address], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Failed to create order' });
    }

    const orderId = result.insertId;

    const itemValues = items.map(item => [
      orderId,
      item.product_id,
      item.quantity,
      item.price,
      item.price
    ]);

    const itemsSql = `
      INSERT INTO order_items (order_id, product_id, quantity, price, price_at_purchase)
      VALUES ?
    `;

    db.query(itemsSql, [itemValues], (err2) => {
      if (err2) {
        console.log(err2);
        return res.status(500).json({ message: 'Failed to save order items' });
      }

      res.json({ message: 'Order placed successfully!', order_id: orderId });
    });
  });
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});