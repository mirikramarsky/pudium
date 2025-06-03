class SchoolRepository{
    async get(){
        let schools = await pool.query('SELECT * FROM schools');
        return schools;
    }
    async getById(id){
        let school = await pool.query(`SELECT * FROM schools where id = ${id}`);
        return school;
    }
    async insert(SchoolCode, SchoolName){
        let school = await pool.query(` INSERT INTO schools (${SchoolCode}, ${SchoolName})`);
        return school;
    }
    async update(SchoolCode, SchoolName){
        let school = await pool.query(` UPDATE schools
            SET schoolname = ${SchoolName}
            WHERE id = ${SchoolCode};`);
        return school;
    }
    async delete(SchoolCode){
        let school = await pool.query(` DELETE FROM schools
            WHERE id = ${SchoolCode};`);
        return school;
    }
}
let schoolRepository = new SchoolRepository();

module.exports = schoolRepository;