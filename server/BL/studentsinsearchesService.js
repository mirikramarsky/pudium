const StuInSeaRepository = require("../DAL/Repositories/studentsInSEarches");
const studentsRepository = require("../DAL/Repositories/studentsRepository");
const studentService = require("./studentsServise");
const BaseService = require("./baseService");
const idError = require("./errors/idError");
class StuInSeaService extends BaseService {
    constructor() {
        super(StuInSeaRepository);
    }
    async getByStudentId(id) {
        let result = await this.repository.getByStudentId(id);
        if (result && result.length != 0)
            return result;
        throw new idError('this id is not exist');
    }
    async getBySearchId(id, schoolId) {
        let result = await this.repository.getBySearchId(id);
        console.log("result", result);
        const s = result.map(s => s.studentid);
        console.log("s",s);
        if(s == []) return [];
        console.log("I still in BL");
        
        result = await studentService.getStudentsByIds(schoolId, s);
        console.log(result);
        
        if (result && result.length != 0)
            return result;
        throw new idError('this id is not exist');
    }
    async insert(searchid, studentsid) {
        const studentsids = JSON.parse(studentsid);
        await Promise.all(
            studentsids.map(s => studentsRepository.decreaseSeveralPriority(s))
        );
        let result = await this.repository.insert(searchid, studentsid);
        if (result && result.length != 0)
            return result;
        throw new idError('this id is not exist');
    }
       async deleteallsearchsstu(searchid) {
        let result = await this.repository.deleteallsearchsstu(searchid);
        
        if (result && result != 0)
            return result;
        throw new idError('this search id is not exist');
    }
}
let stuInSeaService = new StuInSeaService();
module.exports = stuInSeaService;