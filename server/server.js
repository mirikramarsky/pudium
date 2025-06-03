const express = require('express');
const pool = require('./db');

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`I am running at http://localhost:${PORT}`);
});
