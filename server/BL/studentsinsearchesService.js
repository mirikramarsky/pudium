const StuInSeaRepository = require("../DAL/Repositories/studentsInSEarches");
const BaseService = require("./baseService");
class StuInSeaService extends BaseService{
    constructor(){
        super(StuInSeaRepository);
    }
}
let stuInSeaService = new StuInSeaService();
module.exports = stuInSeaService;