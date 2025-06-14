const pool = require('../db');
class StaffRepository{
    async get(){
        let staffs = await pool.query('SELECT * FROM staff');
        return staffs.rows;
    }
    async getBySchoolId(schoolId){
        let staff = await pool.query(`SELECT * FROM staff where schoolId = $1`,[schoolId]);
        return staff.rows;
    }
    async getBySchoolIdAndId(schoolId,id){
        let staff = await pool.query(`SELECT * FROM staff where schoolId = $1 AND id = $2`,[schoolId, id]);
        return staff.rows;
    }
    async insert(params){
        let staff = await pool.query(` INSERT INTO staff (id, schoolId, name, confirm) VALUES ($1,$2,$3,$4)`,[params.id, params.schoolId,
            params.name, params.confirm]);
        return staff;
    }
    async updateName(id, updatedFields){
        let staff = await pool.query(` UPDATE staff
            SET name = $1
            WHERE id = $2 AND schoolId = $3`,[updatedFields.name, id, updatedFields.schoolId]);
        return staff.rowCount > 0 ;
    }
     async update(id, updatedFields){
        let staff = await pool.query(` UPDATE staff
            SET confirm = $1
            WHERE id = $2 AND schoolId = $3`, [updatedFields.confirm, id, updatedFields.schoolId]);
         return staff.rowCount > 0 ;
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