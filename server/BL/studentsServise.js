const BaseService = require("./baseService");
const studentsRepository = require("../DAL/Repositories/studentsRepository");
const idError = require("./errors/idError");
class SudentsService extends BaseService {
    constructor() {
        super(studentsRepository);
    }
    async getById(id, schoolId) {
        let result = await this.repository.getById(id, schoolId);
        if (result && result.length != 0)
            return result;
        throw new idError('this id is not exist');
    }
    async getStudentsByIds(schoolId, studentsIds) {
        const StuId = JSON.parse(studentsIds);

        const promises = StuId.map(SId => this.repository.getById(SId, schoolId));
        const results = await Promise.all(promises);

        // מניח שכל קריאה מחזירה מערך, ולוקחים את האיבר הראשון מכל אחד
        return results
            .filter(res => res && res.length > 0)
            .map(res => res[0]);
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
    async getByFirstName(firstname, schoolId){
         let result = await this.repository.getByFirstName(firstname, schoolId);
        if (result && result.length != 0)
            return result;
        throw new idError('this lastname is not exist');
    }
    async getByLastName(lastName, schoolId){
         let result = await this.repository.getByLastName(lastName, schoolId);
        if (result && result.length != 0)
            return result;
        throw new idError('this lastname is not exist');
    }
    async getByClass(classes, schoolId){
         let result = await this.repository.getByClass(classes, schoolId);
        if (result && result.length != 0)
            return result;
        throw new idError('this lastname is not exist');
    }
    async insert(params) {
        params.severalPriority = 8;
        params.field1Priority = 1;
        params.field2Priority = 1;
        params.field3Priority = 1;
        params.field4Priority = 1;
        let result = await this.repository.insert(params);
        if (result)
            return result
        throw new idError("this id is exist")
    }
    async goUpGrade(schoolid) {
        let result = await this.repository.goUpGrade(schoolid);
        if (result != 0)
            return result
        throw new idError("this id is not exist");

    }
    async getStudentsByParams(params) {
        let result = await this.repository.getStudentsByParams(params);
        if (result == [])
            throw new Error("לא נמצאו תלמידות התואמות את החיפוש");
        else if (result && result.length != 0)
            return result;
        else
            throw new idError('this id is not exist');
    }
}
let sudentsService = new SudentsService();
module.exports = sudentsService;