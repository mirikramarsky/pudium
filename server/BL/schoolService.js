const schoolRepository = require("../DAL/Repositories/schoolRepository");
class SchoolService extends BaseService{
    constructor(){
        super(schoolRepository);
    }
}
let schoolService = new SchoolService();
module.exports = schoolService;