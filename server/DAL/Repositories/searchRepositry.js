const pool = require('../db');
class SearchRepository {
    async get() {
        let searches = await pool.query('SELECT * FROM searches');
        return searches.rows;
    }
    async getById(id) {
        let search = await pool.query(`SELECT * FROM searches where id = $1`, [id]);
        return search.rows;
    }
    async getByStudentId(studentId) {
        let search = await pool.query(`
        SELECT s.*
        FROM searches s
        INNER JOIN studentsinsearches sis ON sis.searchId = s.id
        WHERE sis.studentId = $1
    `, [studentId]);
        return search.rows;
    }
    async getByParams(params) {
        const conditions = [];
        const values = [];
        let i = 1;

        if (params.searchname) {
            conditions.push(`searchname ILIKE $${i++}`);
            values.push(`%${params.searchname}%`);
        }
        if (params.searchdate) {
            conditions.push(`searchdate = $${i++}`);
            values.push(params.searchdate);
        }
        if (params.field) {
            conditions.push(`field ILIKE $${i++}`);
            values.push(`%${params.field}%`);
        }
        if (params.classes && Array.isArray(params.classes) && params.classes.length > 0) {
            conditions.push(`EXISTS (
                SELECT 1 FROM jsonb_array_elements_text(classes::jsonb) AS cls
                WHERE cls = ANY($${i++})
            )`);
            values.push(params.classes);
        }
        if (params.countstudents !== undefined) {
            conditions.push(`countstudents = $${i++}`);
            values.push(params.countstudents);
        }
        if (params.searchername) {
            conditions.push(`searchername ILIKE $${i++}`);
            values.push(`%${params.searchername}%`);
        }

        const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
        const query = `SELECT * FROM searches ${whereClause}`;
        const result = await pool.query(query, values);
        return result.rows;
    }

    async getStudentsBySearchId(searchId) {
        // 1. שליפת החיפוש
        const { rows: searchRows } = await db.query(
            'SELECT * FROM searches WHERE id = $1',
            [searchId]
        );
        const search = searchRows[0];
        if (!search) throw new Error('Search not found');

        // 2. פירוק כיתות ממערך JSON
        let classList = [];
        try {
            classList = JSON.parse(search.classes); // דוגמה: ["a1", "b2", "c3"]
        } catch {
            classList = [];
        }

        let query = '';
        let params = [];

        if (classList.length > 0) {
            // חיפוש לפי כיתות מדויקות
            query = `
        SELECT * FROM students
        WHERE (class || grade::text) = ANY($1)
        `;
            params = [classList];
        } else {
            // חיפוש לפי טווח
            query = `
        SELECT * FROM students
        WHERE grade BETWEEN $1 AND $2
        `;
            params = [search.mingrade, search.maxgrade];
        }

        const { rows: students } = await db.query(query, params);
        return students;
    }
    async insert(params) {
        const now = new Date();
        let search = await pool.query(`INSERT INTO searches (searchname, searchdate, field, countstudents, searchername, classes, searcherid, schoolid,students)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)  RETURNING id`, [params.searchname, now, params.field, params.countstudents, params.searchername,
        JSON.stringify(params.classes), params.searcherId, params.schoolid, params.students]);

        return search.rows[0].id;
    }
    async getSearchesWithStudents(id) {
        const result = await pool.query(`
           SELECT s.*
           FROM searches s
           WHERE s.id IN (
            SELECT DISTINCT searchid
            FROM studentsinsearches
            )
           AND schoolid = $1
        `, [id]);
        return result.rows;
    }
    async getSearchesWithoutStudents(id) {
        const result = await pool.query(`
           SELECT s.*
           FROM searches s
           WHERE s.id NOT IN (
            SELECT DISTINCT searchid
            FROM studentsinsearches
            )
           AND schoolid = $1
        `,[id]);
        return result.rows;
    }
    async update(id, updatedFields) {
        const sets = [];
        const values = [];
        let i = 1;

        for (const key in updatedFields) {
            sets.push(`${key} = $${i++}`);
            values.push(updatedFields[key]);
        }

        if (sets.length === 0) return { message: 'Nothing to update.' };

        values.push(id);
        const query = `UPDATE searches SET ${sets.join(', ')} WHERE id = $${i}`;
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    }
    async delete(id) {
        let search = await pool.query(` DELETE FROM searches
            WHERE id = $1`, [id]);
        return search.rowCount > 0;
    }
    async deleteOldSearches(cutoffDate) {
    const result = await pool.query(`
        DELETE FROM searches
        WHERE searchdate < $1
    `, [cutoffDate]);
    return result.rowCount;
}

}
let searchRepository = new SearchRepository();

module.exports = searchRepository;