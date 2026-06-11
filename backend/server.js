
const express = require('express');
const cors = require('cors');
const db = require('./db');
const crypto = require('crypto');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

app.get('/test' , (req, res) => {
res.json({ message: 'Backend is working!' });
});

function generateEsewaSignature(message, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('base64');
}

app.post('/api/esewa/initiate', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const jwt = require('jsonwebtoken');
  let user;
  try { user = jwt.verify(token, 'ironstore_secret_key'); }
  catch { return res.status(401).json({ message: 'Unauthorized' }); }

  const { amount, order_id } = req.body;

  const merchantCode = "EPAYTEST";          
  const secretKey = "8gBm/:&EnhH.1/q";    
  const transaction_uuid = `${order_id}-${Date.now()}`;

  const message = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${merchantCode}`;
  const signature = generateEsewaSignature(message, secretKey);

 res.json({
    amount,
    transaction_uuid,
    product_code: merchantCode,
    signature,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    success_url: "http://localhost:5173/payment/success",
    failure_url: "http://localhost:5173/payment/failure",
    esewa_url: "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
  });
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

app.get('/api/orders/myorders', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not logged in' });

  const jwt = require('jsonwebtoken');
  let user;
  try {
    user = jwt.verify(token, 'ironstore_secret_key');
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const sql = `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`;
  db.query(sql, [user.id], (err, orders) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (orders.length === 0) return res.json([]);

    let completed = 0;
    orders.forEach((order, index) => {
      const itemsSql = `
        SELECT oi.*, p.name, p.image_url 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = ?
      `;
      db.query(itemsSql, [order.id], (err2, items) => {
        if (err2) items = [];
        orders[index].items = items;
        completed++;
        if (completed === orders.length) {
          res.json(orders);
        }
      });
    });
  });
});

app.post('/api/users/bmi', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not logged in' });

  const jwt = require('jsonwebtoken');
  let user;
  try {
    user = jwt.verify(token, 'ironstore_secret_key');
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const { bmi, fitness_goal, height, weight } = req.body;
  db.query(
  'UPDATE users SET bmi = ?, fitness_goal = ?, height = ?, weight = ? WHERE id = ?',
  [bmi, fitness_goal, height, weight, user.id],
  (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'BMI saved!' });
  }
);
});

app.get('/api/users/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not logged in' });
  const jwt = require('jsonwebtoken');
  let user;
  try { user = jwt.verify(token, 'ironstore_secret_key'); }
  catch { return res.status(401).json({ message: 'Invalid token' }); }

  db.query(
    'SELECT id, name, email, role, bmi, fitness_goal, height, weight FROM users WHERE id = ?',
    [user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(result[0]);
    }
  );
});

app.put('/api/users/update', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not logged in' });

  const jwt = require('jsonwebtoken');
  let user;
  try {
    user = jwt.verify(token, 'ironstore_secret_key');
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  db.query(
    'UPDATE users SET name = ? WHERE id = ?',
    [name, user.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'Profile updated!' });
    }
  );
});

// Admin — get all orders with user info
app.get('/api/admin/orders', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const jwt = require('jsonwebtoken');
  let user;
  try { user = jwt.verify(token, 'ironstore_secret_key'); }
  catch { return res.status(401).json({ message: 'Unauthorized' }); }
  if (user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

  const sql = `
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(result);
  });
});

// Admin — update order status
app.put('/api/admin/orders/:id/status', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const jwt = require('jsonwebtoken');
  let user;
  try { user = jwt.verify(token, 'ironstore_secret_key'); }
  catch { return res.status(401).json({ message: 'Unauthorized' }); }
  if (user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

  const { status } = req.body;
  db.query('UPDATE orders SET order_status = ? WHERE id = ?', [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Status updated' });
  });
});

// Admin — get all users
app.get('/api/admin/users', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const jwt = require('jsonwebtoken');
  let user;
  try { user = jwt.verify(token, 'ironstore_secret_key'); }
  catch { return res.status(401).json({ message: 'Unauthorized' }); }
  if (user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

  db.query('SELECT id, name, email, role, bmi, created_at FROM users ORDER BY created_at DESC', (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(result);
  });
});

// Admin — add product
app.post('/api/admin/products', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const jwt = require('jsonwebtoken');
  let user;
  try { user = jwt.verify(token, 'ironstore_secret_key'); }
  catch { return res.status(401).json({ message: 'Unauthorized' }); }
  if (user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

  const { name, description, price, stock, category_id, img_url } = req.body;
  db.query(
    'INSERT INTO products (name, description, price, stock, category_id, img_url) VALUES (?,?,?,?,?,?)',
    [name, description, price, stock, category_id, img_url],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'Product added', id: result.insertId });
    }
  );
});

// Admin — delete product
app.delete('/api/admin/products/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const jwt = require('jsonwebtoken');
  let user;
  try { user = jwt.verify(token, 'ironstore_secret_key'); }
  catch { return res.status(401).json({ message: 'Unauthorized' }); }
  if (user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

  db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Product deleted' });
  });
});

app.put('/api/admin/products/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const jwt = require('jsonwebtoken');
  let user;
  try { user = jwt.verify(token, 'ironstore_secret_key'); }
  catch { return res.status(401).json({ message: 'Unauthorized' }); }
  if (user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

  const { name, description, price, stock, category_id, image_url } = req.body;
  db.query(
    'UPDATE products SET name=?, description=?, price=?, stock=?, category_id=?, image_url=? WHERE id=?',
    [name, description, price, stock, category_id, image_url || null, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'Product updated' });
    }
  );
});

app.put('/api/admin/users/:id/role', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const jwt = require('jsonwebtoken');
  let user;
  try { user = jwt.verify(token, 'ironstore_secret_key'); }
  catch { return res.status(401).json({ message: 'Unauthorized' }); }
  if (user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });

  const { role } = req.body;
  db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Role updated' });
  });
});

// Admin - get categories
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(result);
  });
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});