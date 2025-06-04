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
    async insert(params){
        let staff = await pool.query(` INSERT INTO staff (${params.id}, ${params.schoolId}, ${params.name}, ${params.confirm})`);
        return staff;
    }
    async updateConfirm(id, updatedFields){
        let staff = await pool.query(` UPDATE staff
            SET name = ${updatedFields.name}
            WHERE id = ${id} AND schoolId = ${updatedFields.schoolId}`);
        return staff;
    }
     async update(id, updatedFields){
        let staff = await pool.query(` UPDATE staff
            SET confirm = ${updatedFields.confirm}
            WHERE id = ${id} AND schoolId = ${updatedFields.schoolId}`);
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