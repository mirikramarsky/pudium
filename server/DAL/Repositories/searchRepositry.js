class SearchRepository{
    async get(){
        let searches = await pool.query('SELECT * FROM searches');
        return searches;
    }
    async getById(id){
        let search = await pool.query(`SELECT * FROM searches where id = ${id}`);
        return search;
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
        if (params.mingrade !== undefined) {
            conditions.push(`mingrade >= $${i++}`);
            values.push(params.mingrade);
        }
        if (params.maxgrade !== undefined) {
            conditions.push(`maxgrade <= $${i++}`);
            values.push(params.maxgrade);
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
    async insert (params){
        let search = await pool.query(` INSERT INTO students (${params.searchname}, ${params.searchdate},${params.field}, ${params.mingrade},
            ${params.maxgrade}, ${params.countstudents},${params.searchername})`);
        return search;
    }
    async updateSearch(id, updatedFields) {
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
        return result.rowCount > 0 ? { message: 'Updated successfully' } : { message: 'Not found' };
    }

    async delete(id){
        let search = await pool.query(` DELETE FROM searches
            WHERE id = ${id};`);
        return search;
    }
}
let searchRepository = new SearchRepository();

module.exports = searchRepository;