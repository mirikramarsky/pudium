const pool = require('../db');
class StudentsRepository{
    async get(){
        let students = await pool.query('SELECT * FROM students');
        return students.rows;
    }
    async getById(id){
        let student = await pool.query(`SELECT * FROM students where id = $1`,id);
        return student.rows;
    }
    async getStudentsByParams(params) {
        const values = [];
        let i = 1;

        // סדר הפרמטרים חשוב כדי להתאים למספרי $ בשאילתה
        values.push(params.myField);       // $1
        values.push(params.schoolId);      // $2
        values.push(params.mingrade);      // $3
        values.push(params.maxgrade);      // $4
        values.push(params.count);         // $5

        const query = `
            SELECT *,
                CASE 
                    WHEN field1 = $1 THEN field1priority
                    WHEN field2 = $1 THEN field2priority
                    WHEN field3 = $1 THEN field3priority
                    WHEN field4 = $1 THEN field4priority
                    ELSE 0
                END AS specific_priority
            FROM students
            WHERE $1 IN (field1, field2, field3, field4)
            AND schoolId = $2
            AND grade BETWEEN $3 AND $4
            ORDER BY 
                GREATEST(severalPriority, 
                        CASE 
                            WHEN field1 = $1 THEN field1priority
                            WHEN field2 = $1 THEN field2priority
                            WHEN field3 = $1 THEN field3priority
                            WHEN field4 = $1 THEN field4priority
                            ELSE 0
                        END
                ) DESC,
                severalPriority DESC,
                specific_priority DESC
            LIMIT $5
        `;
        const result = await pool.query(query, values);
        return result.rows;
    }

    async insert(params){
        let student = await pool.query(` INSERT INTO students(id, firstname, lastname, field1, field2, field3, field4
            , severalpriority, able, field1priority, field2priority, field3priority, field4priority, field1able, field2able, field3able
            ,field4able, grade, schoolid)  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
            [params.id, params.firstname,params.lastname, params.field1, params.field2, params.field3 ,params.field4, 
            params.severalpriority, params.able,params.field1priority, params.field2priority, params.field3priority, params.field4priority,
            params.field1able, params.field2able, params.field3able, params.field4able, params.grade, params.schoolid]);
        return student;
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
        const query = `UPDATE students SET ${sets.join(', ')} WHERE id = $${i}`;
        const result = await pool.query(query, values);
        return result.rowCount > 0 ? { message: 'Updated successfully' } : { message: 'Student not found' };
    }

    async delete(id){
        let student = await pool.query(` DELETE FROM students
            WHERE id = $1`,[id]);
        return student;
    }
}
let studentsRepository = new StudentsRepository();

module.exports = studentsRepository;