const BaseService = require("./baseService");
const studentsRepository = require("../DAL/Repositories/studentsRepository");
class SudentsService extends BaseService{
    constructor(){
        super(studentsRepository);
    }
    async getStudentsByParams(params) {   
        let result = await this.repository.getStudentsByParams(params);
        if (result)
        return result;
    }
}
let sudentsService = new SudentsService();
module.exports = sudentsService;