const pool = require('../db');
class StudentsRepository{
    async get(){
        let students = await pool.query('SELECT * FROM students');
        return students;
    }
    async getById(id){
        let student = await pool.query(`SELECT * FROM students where id = ${id}`);
        return student;
    }
    async getStudentsByParams(params) {
        const conditions = [];
        const values = [];
        let i = 1;

        for (const key in params) {
            if (params[key] !== undefined) {
                conditions.push(`${key} = $${i++}`);
                values.push(params[key]);
            }
        }

        const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
        const query = `SELECT * FROM students ${whereClause} ORDER BY ${params.priority} DESC LIMIT ${params.count}`;
        const result = await pool.query(query, values);
        return result.rows;
    }

    async insert(params){
        let student = await pool.query(` INSERT INTO students(id, firstname, lastname, field1, field2, , field3, field4
            , severalpriority, able, field1priority, field2priority, field3priority, field4priority, field1able, field2able, field3able
            ,field4able, grade, schoolid)  VALUES(${params.id}, ${params.firstname},${params.lastname}, ${params.field1},
            ${params.field2}, ${params.field3},${params.field4},${params.severalpriority},${params.able},${params.field1priority},
            ${params.field2priority}, ${params.field3priority},${params.field4priority}, ${params.field1able},${params.field2able},
            ${params.field3able},${params.field4able},${params.grade},${params.schoolid})`);
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
            WHERE id = ${id};`);
        return student;
    }
}
let studentsRepository = new StudentsRepository();

module.exports = studentsRepository;