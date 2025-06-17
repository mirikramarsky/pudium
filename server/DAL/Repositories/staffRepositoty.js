const pool = require('../db');
class StaffRepository{
    async get(){
        let staffs = await pool.query('SELECT * FROM staff');
        return staffs.rows;
    }
    async getBySchoolId(schoolId){//כל הצוות של בית ספר מסוים
        let staff = await pool.query(`SELECT * FROM staff WHERE schoolId = $1`,[schoolId]);
        return staff.rows;
    }
    // async getById(id){ //מביא את כל המופעים של המורה -בכל בתי הספר שהיא עובדת - מיותר
    //     let staff = await pool.query(`SELECT * FROM staff WHERE id = $1`,[id]);
    //     return staff.rows;
    // }
    async getBySchoolIdAndId(schoolId,id){//לקבל מורה לפי ID ובית הספר שלה
        let staff = await pool.query(`SELECT * FROM staff WHERE schoolId = $1 AND id = $2`,[schoolId, id]);
        return staff.rows;
    }
    async insert(params){
        let staff = await pool.query(` INSERT INTO staff (id, schoolId, name, confirm, class) VALUES ($1,$2,$3,$4,$5)`,[params.id, params.schoolId,
            params.name, params.confirm, params.class]);
        return staff;
    }
    // async updateName(id, updatedFields){
    //     let staff = await pool.query(` UPDATE staff
    //         SET name = $1
    //         WHERE id = $2 AND schoolId = $3`,[updatedFields.name, id, updatedFields.schoolId]);
    //     return staff.rowCount > 0 ;
    // }
    //  async update(id, updatedFields){
    //     let staff = await pool.query(` UPDATE staff
    //         SET confirm = $1
    //         WHERE id = $2 AND schoolId = $3`, [updatedFields.confirm, id, updatedFields.schoolId]);
    //      return staff.rowCount > 0 ;
    // }
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
        const query = `UPDATE staff SET ${sets.join(', ')} WHERE id = $${i}`;
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    }
    async delete(id, schoolId){
        try{
        let staff = await pool.query(` DELETE FROM staff
            WHERE id = $1 AND schoolId = $2`,[id, schoolId]);
        return staff.rowCount > 0 ;
        }
        catch(err){
            console.error(err);
        }
    }
}
let staffRepository = new StaffRepository();

module.exports = staffRepository;