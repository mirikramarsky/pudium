const searchRepository = require("../DAL/Repositories/searchRepositry");
const BaseService = require("./baseService");
const stuInSeaRepository = require('../DAL/Repositories/studentsInSEarches');
const schoolRepository = require('../DAL/Repositories/schoolRepository');
const mailer = require('../utils/mailer');

const BASE_URL = 'https://pudium-production.up.railway.app/api/podium';
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
  async getSearchesWithStudents(id) {
    let result = await this.repository.getSearchesWithStudents(id);
    if (result && result.length != 0)
      return result;
    throw new idError('שליפת החיפושים נכשלה');
  }
  async getSearchesWithoutStudents(id) {
    let result = await this.repository.getSearchesWithoutStudents(id);
    if (result && result.length != 0)
      return result;
    throw new idError('שליפת החיפושים נכשלה');
  }
  async sendApprovalMail(searchId, schoolid, dataFromClient) {
    const search = await this.repository.getById(searchId);
    if (!search) throw new Error('חיפוש לא נמצא');
    
    const school = await schoolRepository.getById(schoolid);
    const schoolEmail = school[0].emailaddress;
    if (!schoolEmail) throw new Error('לא נמצא מייל לבית הספר');

    const students = dataFromClient.students
    const parsed = JSON.parse(search[0].classes);
    const classes = Array.isArray(parsed) ? parsed.join(', ') : '';
    const studentsIds = students.map(s => s.id);
    let studentRows =await students.map(s => `
        <tr>
            <td>${s.firstname}</td>
            <td>${s.lastname}</td>
            <td>${s.class} ${s.grade}</td>
            <td>${s.field1}</td>
            <td>${s.field2}</td>
            <td>${s.field3}</td>
            <td>${s.field4}</td>
            <td>${s.severalpriority}</td>
        </tr>`).join('');
    const html = `
<div dir="rtl" style="
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Assistant', sans-serif;
  color: #333;
  background: linear-gradient(to bottom, rgba(74,155,158) 71%, rgba(212,227,233) 29%);
  padding: 20px;
  box-sizing: border-box;
">

  <div style="background-color: white; border-radius: 12px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">

    <h2 style="color:rgb(12, 102, 109);">📝 פרטי החיפוש שלך</h2>
    <ul style="list-style: none; padding: 0;">
      <li><strong>שם מחפשת:</strong> ${search[0].searchername}</li>
      <li><strong>תחום:</strong> ${search[0].field}</li>
      <li><strong>כיתות:</strong> ${classes}</li>
      <li><strong>כמות תלמידות:</strong> ${search[0].countstudents}</li>
    </ul>

    <h3 style="margin-top: 30px;"> רשימת תלמידות</h3>
    <div style="overflow-x: auto;">
      <table border="1" cellspacing="0" cellpadding="6" style="width: 100%; border-collapse: collapse; text-align: center; font-size: 1rem;">
        <thead style="background-color: #dfe6e9;">
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
    </div>

    <h3 style="margin-top: 30px;">📩 בחרי פעולה</h3>
    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">

      <form action="https://pudium-production.up.railway.app/api/podium/searches/${searchId}/approve" method="POST" style="display:inline;">
        <input type="hidden" name="studentsid" value='${JSON.stringify(studentsIds)}'>
        <button type="submit" style="padding: 15px 25px; background-color: #66bb6a; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
          ✔️ אשר חיפוש
        </button>
      </form>

      <span style="padding: 15px 25px; background-color: #3498db; color: white; border-radius: 8px; display: inline-block;">
        ⏸️ החיפוש מושהה
      </span>

      <a href="https://fearless-warmth-production.up.railway.app/search-results/${searchId}?schoolId=${schoolid}" style="padding: 15px 25px; background-color: #a334db; color: white; text-decoration: none; border-radius: 8px;">
        📝 ערוך חיפוש
      </a>

      <a href="https://pudium-production.up.railway.app/api/podium/searches/${searchId}/delete"
        style="padding: 15px 25px; background-color: #e74c3c; color: white; text-decoration: none; border-radius: 8px;">
        ❌ מחק חיפוש
      </a>
    </div>

  </div>
</div>


`;

console.log(html);
    await mailer.sendMail(schoolEmail, dataFromClient.subject, html);
  }

}
let searchService = new SearchService();
module.exports = searchService;