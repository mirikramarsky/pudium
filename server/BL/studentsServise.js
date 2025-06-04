const BaseService = require("./baseService");
const studentsRepository = require("../DAL/Repositories/studentsRepository");
class SudentsService extends BaseService{
    constructor(){
        super(studentsRepository);
    }
    async getStudentsByParams(params) {  
         switch(params.myField){
             case(params.field1):
             {

                break;
             }
             case(params.field2):
             {

                break;
             }
              case(params.field3):
             {

                break;
             }
             case(params.field4):
             {

                break;
             }
         }
        
        let result = await this.repository.getStudentsByParams(params);
        if (result)
        return result;
    }
}
let sudentsService = new SudentsService();
module.exports = sudentsService;