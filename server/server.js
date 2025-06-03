const express = require('express');
const pool = require('./DAL/db');

const app = express();
app.use(express.json());

app.get('/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying the database');
  }
});

app.get('/', async (req, res) => {
  try {
   const result = await pool.query('SELECT 1');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying the database');
  }
});
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`I am running at http://0.0.0.0:${port}`);
});
