//const idError = require("./Errors/idError");
class BaseService {
    constructor(repository) {
        this.repository = repository;
    }
    async get() {
        let result = await this.repository.get();
        return result;
    }
    async getById(id) {
        let result = await this.repository.getById(id);
        if (result && result.length != 0)
            return result;
       throw new idError('this id is not exist');
    }
    async insert(params){
        let result = await this.repository.insert(params);
        return result
    }
    async update(id, updatedFields){
        let result = await this.repository.update(id, updatedFields);
        if(result != null)
            return result;
    }
    async delete(id) {   
        let result = await this.repository.delete(id);
        if (result)
        return result;
    }
}
module.exports = BaseService;