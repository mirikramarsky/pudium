const schoolRepository = require("../DAL/Repositories/schoolRepository");
const BaseService = require("./baseService");
class SchoolService extends BaseService{
    constructor(){
        super(schoolRepository);
    }
     async insert(params){
        if (!params.fields)
            params.fields = JSON.stringify(["שירה", "מחול", "אימון שיר", "תפאורה","כתיבת שיר", "עריכה", "הצגה", "אימון הצגה"])
        let result = await this.repository.insert(params);
        if(result)
            return result
        throw new idError("this id is exist")
    }
}
let schoolService = new SchoolService();
module.exports = schoolService;