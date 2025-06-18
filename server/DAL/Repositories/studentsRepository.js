const pool = require('../db');
class StudentsRepository {
    async get() {
        let students = await pool.query('SELECT * FROM students');
        return students.rows;
    }
    async getById(id, schoolId) {
        let student = await pool.query(`SELECT * FROM students WHERE id = $1 AND schoolId = $2`, [id, schoolId]);
        return student.rows;
    }
    async getBySchoolIdId(schoolId) {
        let student = await pool.query(`SELECT * FROM students WHERE schoolId = $1`, [schoolId]);
        return student.rows;
    }
    async getStudentsByParams(params) {
        const values = [];

        values.push(params.myField);       // $1
        values.push(params.schoolId);      // $2
        values.push(params.classes);       // $3
        values.push(params.count);         // $4
        values.push(params.excludeIds || []); // $5 - רשימת מזהים להחרגה

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
            AND (
                (field1 = $1 AND field1priority != 0) OR
                (field2 = $1 AND field2priority != 0) OR
                (field3 = $1 AND field3priority != 0) OR
                (field4 = $1 AND field4priority != 0)
            )
            AND schoolId = $2
            AND (class || grade::text) = ANY($3)
            AND severalPriority != 0
            AND id != ALL($5::int[])  -- החרגת מזהים
            ORDER BY 
                educpriority DESC,  -- ✅ קודם כל מי שיש לה עדיפות חינוכית
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
            LIMIT $4
            `;

        const result = await pool.query(query, values);
        return result.rows;
    }

    async insert(params) {
        const query = `
        INSERT INTO students(
            id, firstname, lastname, field1, field2, field3, field4,
            severalpriority, field1priority, field2priority, field3priority, field4priority,
            class, grade, schoolid
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `;

        const values = [
            params.id,
            params.firstname,
            params.lastname,
            params.field1,
            params.field2,
            params.field3,
            params.field4,
            params.severalPriority,
            params.field1Priority,
            params.field2Priority,
            params.field3Priority,
            params.field4Priority,
            params.class,
            params.grade,
            params.schoolid
        ];

        const student = await pool.query(query, values);
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
        return result.rowCount > 0;
    }
    async decreaseSeveralPriority(id) {
        let result;
        const resultp = await pool.query(`SELECT severalpriority FROM students WHERE id = $1`, [id]);
        console.log(resultp);
        
        const lastseveralPriority = resultp.rows[0].severalpriority;
        console.log(`lastseveralPriority : ${lastseveralPriority}`);
        if (lastseveralPriority > 1)
            result = await pool.query(`UPDATE students SET severalpriority = $1 WHERE id = $2`, [lastseveralPriority - 1, id]);
        return result;
    }
    async goUpGrade(schoolid) {
        const query = `
    UPDATE students
    SET class = CASE 
      WHEN class = 'ט' THEN 'י'
      WHEN class = 'י' THEN 'יא'
      WHEN class = 'יא' THEN 'יב'
      ELSE class
    END
    WHERE schoolid = $1
  `;
        await pool.query(query, [schoolid]);
    }

    async delete(id) {
        let student = await pool.query(` DELETE FROM students
            WHERE id = $1`, [id]);
        return student.rowCount > 0;
    }
}
let studentsRepository = new StudentsRepository();

module.exports = studentsRepository;