const BaseService = require("./baseService");
const studentsRepository = require("../DAL/Repositories/studentsRepository");
const searchRepository = require("../DAL/Repositories/searchRepositry");
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
        console.log("studentsIds", studentsIds);
        let StuId = studentsIds;
        // אם זה מחרוזת, הופכים אותה למערך
        if(typeof studentsIds === 'string') 
         StuId = JSON.parse(studentsIds);
        console.log("StuId", StuId);
        const promises = StuId.map(SId => this.repository.getById(SId, schoolId));
        console.log("promises", promises);
        const results = await Promise.all(promises);
        console.log("results", results);
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
    async getByFirstName(firstname, schoolId) {
        let result = await this.repository.getByFirstName(firstname, schoolId);
        if (result && result.length != 0)
            return result;
        throw new idError('this lastname is not exist');
    }
    async getByLastName(lastName, schoolId) {
        let result = await this.repository.getByLastName(lastName, schoolId);
        if (result && result.length != 0)
            return result;
        throw new idError('this lastname is not exist');
    }
    async getByClass(classes, schoolId) {
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
    async goUpGrade(schoolId) {
     // שלב 1: מחיקת תלמידות יב
    await this.repository.deleteGraduatedStudents(schoolId);

    // שלב 2: העלאת שנה לכל השאר
    const updatedCount = await this.repository.goUpGrade(schoolId);
    if (updatedCount === 0) {
        throw new idError("this id is not exist");
    }

    // שלב 3: מחיקת חיפושים ישנים
    const now = new Date();
    const currentYear = now.getFullYear();
    const cutoffDate = new Date(`${currentYear - 1}-09-01`);
    await searchRepository.deleteOldSearches(cutoffDate);

    return updatedCount;
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