const pool = require('./db'); 

console.log(process.env.DATABASE_URL);

const deleteT = async () => {
  try {
    await pool.query(`DELETE FROM studentsinsearches`)
    await pool.query(`DELETE FROM searches WHERE id < 131`);
         } catch (err) {
    console.error("❌ שגיאה במחיקה  מהטבלאות:", err);
  } finally {
    pool.end();
  }
};
module.exports = deleteT;