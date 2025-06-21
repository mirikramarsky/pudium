const pool = require('../db');
class SchoolRepository {
    async get() {
        let schools = await pool.query('SELECT * FROM schools');
        return schools.rows;
    }
    async getById(id) {
        let school = await pool.query(`SELECT * FROM schools where id = $1`,[id]);
        return school.rows;
    }
    async insert(params) {
        let school = await pool.query(
            `INSERT INTO schools (schoolname, emailaddress, fields) VALUES($1, $2, $3)`,
            [params.SchoolName,params.emailaddress ,params.fields]
        ); 
        return school;
    }
    async update(id, updatedFields) {
        const sets = [];
        const values = [];
        let i = 1;

        for (const key in updatedFields) {
            if (updatedFields[key] !== undefined) {
                sets.push(`${key} = $${i++}`);
                values.push(updatedFields[key]);
            }
        }

        if (sets.length === 0) return { message: 'Nothing to update.' };

        values.push(id);
        const query = `UPDATE schools SET ${sets.join(', ')} WHERE id = $${i}`;
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    }
    async delete(SchoolCode) {
        let school = await pool.query(` DELETE FROM schools
            WHERE id = $1`,[SchoolCode]);
        return school.rowCount;
    }
}
let schoolRepository = new SchoolRepository();

module.exports = schoolRepository;