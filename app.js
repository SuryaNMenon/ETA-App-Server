const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(morgan('dev'));

// PostgreSQL Connection
const pool = new Pool({
  host: 'localhost',     // Update with the IP address or hostname of your PostgreSQL server
  user: 'your_username', // Update with your PostgreSQL username
  password: 'your_password', // Update with your PostgreSQL password
  database: 'test',
  port: 5432,            // Default PostgreSQL port
});

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the public_html directory
app.use(express.static(path.join(__dirname, 'public_html')));

// Route to handle adding an expense
app.post('/addExpense', async (req, res) => {
  const { category, amount, date, description } = req.body;

  const sql = 'INSERT INTO expenses (category, amount, date, description) VALUES ($1, $2, $3, $4)';
  const values = [category, amount, date, description];

  try {
    console.log('Executing SQL query:', sql, 'with values:', values);

    const result = await pool.query(sql, values);
    console.log('Expense added in PostgreSQL');
    res.status(200).send('Expense added in PostgreSQL');
  } catch (err) {
    console.error('PostgreSQL query error: ' + err.stack);
    res.status(500).send('Error adding expense in PostgreSQL: ' + err.message);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', reason.stack || reason);
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(Server running on port ${port});
});