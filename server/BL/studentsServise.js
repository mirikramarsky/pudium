const BaseService = require("./baseService");
const studentsRepository = require("../DAL/Repositories/studentsRepository");
const idError = require("./errors/idError");
class SudentsService extends BaseService{
    constructor(){
        super(studentsRepository);
    }
     async getById(id,schoolId) {
        let result = await this.repository.getById(id, schoolId);
        if (result && result.length != 0)
            return result;
       throw new idError('this id is not exist');
    }
      async insert(params){
        params.severalPriority = 1;
        params.field1Priority = 1;
        params.field2Priority = 1;
        params.field3Priority = 1;
        params.field4Priority = 1;
        let result = await this.repository.insert(params);
        console.log("trrrrrrrrmnjbhgfcgvhgyutfcghuyftfgchuyfdfcghuyfcghuytyrrrrrrrrrrr " + JSON.stringify(result));
        if(result)
            return result
        throw new idError("this id is exist")
    }
    async getStudentsByParams(params) {          
        let result = await this.repository.getStudentsByParams(params);
        if (result && result.length != 0)
            return result;
       throw new idError('this id is not exist');
    }
}
let sudentsService = new SudentsService();
module.exports = sudentsService;