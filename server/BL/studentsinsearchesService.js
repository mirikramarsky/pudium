const StuInSeaRepository = require("../DAL/Repositories/studentsInSEarches");
const BaseService = require("./baseService");
class StuInSeaService extends BaseService{
    constructor(){
        super(StuInSeaRepository);
    }
     async getByStudentId(id) {   
        let result = await this.repository.getByStudentId(id);
        if (result && result.length != 0)
            return result;
       throw new idError('this id is not exist');
    }
      async getBySearchId(id) {   
        let result = await this.repository.getBySearchId(id);
        if (result && result.length != 0)
            return result;
       throw new idError('this id is not exist');
    } 
    async insert(searchid, studentsid){
         let result = await this.repository.insert(searchid, studentsid);
        if (result && result.length != 0)
            return result;
       throw new idError('this id is not exist');
    } 
}
let stuInSeaService = new StuInSeaService();
module.exports = stuInSeaService;