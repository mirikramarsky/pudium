const idError = require("./errors/idError");
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
        console.log("trrrrrrrrmnjbhgfcgvhgyutfcghuyftfgchuyfdfcghuyfcghuytyrrrrrrrrrrr " + JSON.stringify(result));
        if(result)
            return result
        throw new idError("this id is exist")
    }
    async update(id, updatedFields){
        let result = await this.repository.update(id, updatedFields);
        if(result != 0)
            return result;
        throw new idError('this id is not exist');
    }
    async delete(id) {   
        let result = await this.repository.delete(id);
        if(result != 0)
            return result;
        throw new idError('this id is not exist');
    }
}
module.exports = BaseService;