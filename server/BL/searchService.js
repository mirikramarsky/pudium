const searchRepository = require("../DAL/Repositories/searchRepositry");
const BaseService = require("./baseService");
const stuInSeaRepository = require('../DAL/Repositories/studentsInSEarches');
const schoolRepository = require('../DAL/Repositories/schoolRepository');
const mailer = require('../utils/mailer');

const BASE_URL = 'https://pudium-client.yoursite.com'; // שנה לכתובת שלך
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
    async sendApprovalMail(searchId) {
        const search = await this.repository.getById(searchId);
        if (!search) throw new Error('חיפוש לא נמצא');

        const school = await schoolRepository.getById(search.schoolid);
        console.log(school.data);
        const schoolEmail = school.data.email;
        if (!schoolEmail) throw new Error('לא נמצא מייל לבית הספר');

        const students = await stuInSeaRepository.getStudentsInSearch(searchId);

        let studentRows = students.map(s => `
        <tr>
            <td>${s.firstname}</td>
            <td>${s.lastname}</td>
            <td>${s.grade} ${s.class}</td>
            <td>${s.field1}</td>
            <td>${s.severalpriority}</td>
        </tr>`).join('');

        const html = `
        <p>שלום,</p>
        <p>להלן פרטי החיפוש:</p>
        <ul>
            <li><b>שם מחפשת:</b> ${search.searchername}</li>
            <li><b>תחום:</b> ${search.field}</li>
            <li><b>כיתות:</b> ${JSON.parse(search.classes).join(', ')}</li>
            <li><b>כמות תלמידות:</b> ${search.countstudents}</li>
        </ul>
        <p>רשימת התלמידות:</p>
        <table border="1" cellspacing="0" cellpadding="4">
            <thead>
                <tr>
                    <th>שם פרטי</th>
                    <th>שם משפחה</th>
                    <th>כיתה</th>
                    <th>תחום 1</th>
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