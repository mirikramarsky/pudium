class StaffRepository{
    async get(){
        let staffs = await pool.query('SELECT * FROM staff');
        return staffs;
    }
    async getById(id){
        let staff = await pool.query(`SELECT * FROM staff where id = ${id}`);
        return staff;
    }
    async getBySchoolId(schoolId){
        let staff = await pool.query(`SELECT * FROM staff where schoolId = ${schoolId}`);
        return staff;
    }
    async getBySchoolIdAndId(schoolId,id){
        let staff = await pool.query(`SELECT * FROM staff where schoolId = ${schoolId} AND id = ${id}`);
        return staff;
    }
    async insert(id, schoolId, name, confirm){
        let staff = await pool.query(` INSERT INTO staff (${id}, ${schoolId}, ${name}, ${confirm})`);
        return staff;
    }
    async updateConfirm(id, schoolId, name){
        let staff = await pool.query(` UPDATE staff
            SET name = ${name}
            WHERE id = ${id} AND schoolId = ${schoolId}`);
        return staff;
    }
     async updateName(id, schoolId, confirm){
        let staff = await pool.query(` UPDATE staff
            SET confirm = ${confirm}
            WHERE id = ${id} AND schoolId = ${schoolId}`);
        return staff;
    }
    async delete(id, schoolId){
        let staff = await pool.query(` DELETE FROM staff
            WHERE id = ${id} AND schoolId = ${schoolId}`);
        return staff;
    }
}
let staffRepository = new StaffRepository();

module.exports = staffRepository;