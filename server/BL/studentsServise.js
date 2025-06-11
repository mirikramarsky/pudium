const BaseService = require("./baseService");
const studentsRepository = require("../DAL/Repositories/studentsRepository");
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
    async getStudentsByParams(params) {          
        let result = await this.repository.getStudentsByParams(params);
        if (result)
        return result;
    }
}
let sudentsService = new SudentsService();
module.exports = sudentsService;