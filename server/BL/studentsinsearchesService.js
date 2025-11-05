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
        console.log("I am in getBySearchId service", id, schoolId);

        let result = await this.repository.getBySearchId(id);
        console.log("result", result);

        const s = result.map(s => s.studentid);
        if (s.length == 0)
            return [];
        console.log("s", s);

        result = await studentService.getStudentsByIds(schoolId, s);
        console.log("result2", result);

        if (result && result.length != 0)
            return result;
        throw new idError('this id is not exist');
    }
    async insert(searchid, studentsid) {
        console.log("I am in stuInSeaService insert", searchid, studentsid);
        const studentsids = JSON.parse(studentsid);
        console.log("studentsids:", studentsids);
        await Promise.all(
            studentsids.map(s => studentsRepository.decreaseSeveralPriority(s))
        );
        console.log("studentsids:", studentsids);
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
       async deleteStudents(studentid) {
        console.log("I am in deleteStudents service", studentid);
        
        let result = await this.repository.deleteStudents(studentid);
        if (result && result != 0)
            return result;
        throw new idError('this student id is not exist');
    }
}
let stuInSeaService = new StuInSeaService();
module.exports = stuInSeaService;