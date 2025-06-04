const schoolRepository = require("../DAL/Repositories/schoolRepository");
const BaseService = require("./baseService");
class SchoolService extends BaseService{
    constructor(){
        super(schoolRepository);
    }
}
let schoolService = new SchoolService();
module.exports = schoolService;