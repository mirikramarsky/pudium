const pool = require('../db');
class StuInSeaRepository {
    async get() {
        let studentsinsearches = await pool.query('SELECT * FROM studentsinsearches');
        return studentsinsearches.rows;
    }
    async getById(id) {
        let studentsinsearches = await pool.query(`SELECT * FROM studentsinsearches where id = $1`, [id]);
        return studentsinsearches.rows;
    }
    async getBySearchId(id) {
        let studentsinsearches = await pool.query(`SELECT * FROM studentsinsearches where searchid = $1`, [id]);
        return studentsinsearches.rows;
    }
    async getByStudentId(id) {
        let studentsinsearches = await pool.query(`SELECT * FROM studentsinsearches where studentid = $1`, [id]);
        return studentsinsearches.rows;
    }
    async insert(params) {
        let studentsinsearches = await pool.query(
            `INSERT INTO studentsinsearches (searchid, studentid) VALUES($1, $2)`,
            [params.searchid, params.studentid]
        );
        return studentsinsearches;
    }
    async insert(searchid, studentsid) {
        const promises = studentsid.map(student =>
            pool.query(
                `INSERT INTO studentsinsearches (searchid, studentid) VALUES($1, $2)`,
                [searchid, student]
            )
        );

        const results = await Promise.all(promises);
        return results;
    }

    async update(id, params) {
        let studentsinsearches = await pool.query(` UPDATE studentsinsearches
            SET studentid = $1
            WHERE id = $2 `, [params.studentid, id]);
        return studentsinsearches.rowCount;
    }
    async delete(id) {
        let studentsinsearches = await pool.query(` DELETE FROM studentsinsearches
            WHERE id = $1`, [id]);
        return studentsinsearches.rowCount;
    }
}
let stuInSeaRepository = new StuInSeaRepository();

module.exports = stuInSeaRepository;