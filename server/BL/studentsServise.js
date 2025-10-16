const BaseService = require("./baseService");
const studentsRepository = require("../DAL/Repositories/studentsRepository");
const searchRepository = require("../DAL/Repositories/searchRepositry");
const staffRepository = require("../DAL/Repositories/staffRepositoty");
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
        if (typeof studentsIds === 'string')
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
        let result = await this.repository.getBySchoolId(schoolId);
        if (result && result.length != 0)
            return result;
        throw new idError('this id is not exist');
    }
    async update(id, updatedFields){
        const schoolId = updatedFields.schoolId
        let result = await this.repository.update(id, schoolId,  updatedFields);
        if(result != 0)
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
    const results = {
        added: [],
        skipped: []
    };

    for (let i = 0; i < params.students.length; i++) {
        const student = params.students[i];

        student.severalPriority = 8;
        student.field1Priority = 1;
        student.field2Priority = 1;
        student.field3Priority = 1;
        student.field4Priority = 1;
        student.field1 = null;
        student.field2 = null;
        student.field3 = null;
        student.field4 = null;

        try {
            const result = await this.repository.insert(student);
            results.added.push({
                id: student.id,
                firstname: student.firstname,
                lastname: student.lastname
            });
        } catch (err) {   
            if (err.statusCode == 409 || err instanceof DuplicateIdError) {
                console.log(`Student with ID ${student.id} already exists.`);
                results.skipped.push({
                    id: student.id,
                    reason: "כבר קיימת"
                });
            } else {
                results.skipped.push({
                    id: student.id,
                    reason: "שגיאה לא צפויה"
                });
                console.error(`שגיאה בהוספת תלמידה ${student.id}:`, err);
            }
        }
    }

    return results;
}


    async goUpGrade(schoolId) {
        // שלב 1: מחיקת תלמידות יב
        await this.repository.deleteGraduatedStudents(schoolId);

        // שלב 2: העלאת שנה לכל השאר
        const updatedCount = await this.repository.goUpGrade(schoolId);
        if (updatedCount === 0) {
            throw new idError("this id is not exist");
        }

        // שלב 3: עדכון צוות בית הספר
        const staffMembers = await staffRepository.getBySchoolId(schoolId);
        for (const staff of staffMembers) {
            const updatedFields = {
                class: ""
            };
            await staffRepository.update(staff.id, updatedFields);
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