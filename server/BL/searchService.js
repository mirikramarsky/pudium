const searchRepository = require("../DAL/Repositories/searchRepositry");
const BaseService = require("./baseService");
const stuInSeaRepository = require('../DAL/Repositories/studentsInSEarches');
const schoolRepository = require('../DAL/Repositories/schoolRepository');
const mailer = require('../utils/mailer');

const BASE_URL = 'https://pudium-production.up.railway.app/api/podium'; // שנה לכתובת שלך
class SearchService extends BaseService {
    constructor() {
        super(searchRepository);
    }
    async getByParams(params) {
        let result = await this.repository.getByParams(params);
        if (result && result.length != 0)
            return result;
        throw new idError('this id is not exist');
    }
    async getStudentsBySearchId(searchId) {
        let result = await this.repository.getStudentsBySearchId(searchId);
        if (result && result.length != 0)
            return result;
        throw new idError('this id is not exist');
    }
    async getSearchesWithStudents() {
        let result = await this.repository.getSearchesWithStudents();
        if (result && result.length != 0)
            return result;
        throw new idError('שליפת החיפושים נכשלה');
    }
    async getSearchesWithoutStudents() {
        let result = await this.repository.getSearchesWithoutStudents();
        if (result && result.length != 0)
            return result;
        throw new idError('שליפת החיפושים נכשלה');
    }
    async sendApprovalMail(searchId, schoolid) {
        const search = await this.repository.getById(searchId);
        if (!search) throw new Error('חיפוש לא נמצא');

        const school = await schoolRepository.getById(schoolid);
        console.log(school[0]);
        const schoolEmail = school[0].emailaddress;
        if (!schoolEmail) throw new Error('לא נמצא מייל לבית הספר');

        const students = await stuInSeaRepository.getStudentsInSearch(searchId);
        // console.log(JSON.parse(search.classes).join(', '));
        console.log(search[0].classes);
            const parsed = JSON.parse(search.classes);
            classes =  Array.isArray(parsed) ? parsed.join(', ') : '';
            console.log(students);
            
        let studentRows = students.map(s => `
        <tr>
            <td>${s.firstname}</td>
            <td>${s.lastname}</td>
            <td>${s.grade} ${s.class}</td>
            <td>${s.field1}</td>
            <td>${s.field2}</td>
            <td>${s.field3}</td>
            <td>${s.field4}</td>
            <td>${s.severalpriority}</td>
        </tr>`).join('');

        const html = `
        <p>שלום,</p>
        <p>להלן פרטי החיפוש:</p>
        <ul>
            <li><b>שם מחפשת:</b> ${search[0].searchername}</li>
            <li><b>תחום:</b> ${search[0].field}</li>
            <li><b>כיתות:</b> ${classes.join(', ')}</li>
            <li><b>כמות תלמידות:</b> ${search[0].countstudents}</li>
        </ul>
        <p>רשימת התלמידות:</p>
        <table border="1" cellspacing="0" cellpadding="4">
            <thead>
                <tr>
                    <th>שם פרטי</th>
                    <th>שם משפחה</th>
                    <th>כיתה</th>
                    <th>תחום 1</th>
                    <th>תחום 2</th>
                    <th>תחום 3</th>
                    <th>תחום 4</th>
                    <th>עדיפות כללית</th>
                </tr>
            </thead>
            <tbody>
                ${studentRows}
            </tbody>
        </table>
        <p>בחרו פעולה:</p>
        <p>
            <a href="${BASE_URL}/searches/${searchId}/approve" style="margin-left:10px;">✔️ אשר חיפוש</a>
            <a href="${BASE_URL}/searches/${searchId}/edit" style="margin-left:10px;">📝 ערוך חיפוש</a>
            <a href="${BASE_URL}/searches/${searchId}/delete" style="color:red; margin-left:10px;">❌ מחק חיפוש</a>
        </p>
    `;

        await mailer.sendMail(schoolEmail, 'אישור חיפוש תלמידות', html);
    }

}
let searchService = new SearchService();
module.exports = searchService;