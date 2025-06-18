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
      async getClassesBySchoolId(schoolId) {
        let result = await this.repository.getClassesBySchoolId(schoolId);
        if (result && result.length != 0)
            return result;
       throw new idError('this id is not exist');
    }
     async getBySchoolId(schoolId) { 
        let result = await this.repository.getBySchoolIdId(schoolId);
        if (result && result.length != 0)
            return result;
       throw new idError('this id is not exist');
    }
      async insert(params){
        params.severalPriority = 8;
        params.field1Priority = 1;
        params.field2Priority = 1;
        params.field3Priority = 1;
        params.field4Priority = 1;
        let result = await this.repository.insert(params);
        if(result)
            return result
        throw new idError("this id is exist")
    }
    async goUpGrade(schoolid){
        let result = await this.repository.goUpGrade(schoolid);
        if(result)
            return result
        throw new idError("this id is not exist");
        
    }
    async getStudentsByParams(params) {          
        let result = await this.repository.getStudentsByParams(params);
        console.log(result);
        if(result == [])
            throw new Error("לא נמצאו תלמידות התואמות את החיפוש");
        if (result && result.length != 0)
            return result;
       throw new idError('this id is not exist');
    }
}
let sudentsService = new SudentsService();
module.exports = sudentsService;