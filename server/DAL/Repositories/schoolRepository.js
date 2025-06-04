const pool = require('../db');
class SchoolRepository {
    async get() {
        let schools = await pool.query('SELECT * FROM schools');
        console.log(schools);
        return schools;
    }
    async getById(id) {
        let school = await pool.query(`SELECT * FROM schools where id = ${id}`);
        return school.rows;
    }
    async insert(params) {
        let school = await pool.query(
            `INSERT INTO schools (id, schoolname) VALUES($1, $2)`,
            [params.SchoolCode, params.SchoolName]
        ); return school;
    }
    async update(SchoolCode, params) {
        let school = await pool.query(` UPDATE schools
            SET schoolname = ${params.SchoolName}
            WHERE id = ${SchoolCode};`);
        return school;
    }
    async delete(SchoolCode) {
        let school = await pool.query(` DELETE FROM schools
            WHERE id = ${SchoolCode};`);
        return school;
    }
}
let schoolRepository = new SchoolRepository();

module.exports = schoolRepository;