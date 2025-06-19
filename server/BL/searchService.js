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


    let studentRows = students.map(s => `
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
<div dir="rtl" style="font-family: Assistant, Heebo, sans-serif; background-color: #cfe3f3; padding: 20px; color: #333; font-size: 1.2rem;">
  <div style="background-color: #2a3b8f; color: white; padding: 1rem; text-align: center; border-bottom: 4px solid #d9e3f0;">
    <p style="font-size: xxx-large; margin: 0;">פודיום</p>
    <p style="margin: 0;">לתת במה לכולן</p>
  </div>

  <h2 style="color: #2c3e50; margin-top: 30px;">📝 פרטי החיפוש שלך</h2>
  <ul style="list-style: none; padding: 0;">
    <li><strong>שם מחפשת:</strong> ${search[0].searchername}</li>
    <li><strong>תחום:</strong> ${search[0].field}</li>
    <li><strong>כיתות:</strong> ${classes}</li>
    <li><strong>כמות תלמידות:</strong> ${search[0].countstudents}</li>
  </ul>

  <h3 style="margin-top: 30px;">👩‍🎓 רשימת תלמידות</h3>
  <table border="1" cellspacing="0" cellpadding="6" style="width: 100%; border-collapse: collapse; background-color: #fff; text-align: right;">
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

  <h3 style="margin-top: 30px;">📩 בחרי פעולה</h3>
  <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">

    <form action="https://pudium-production.up.railway.app/api/podium/searches/${searchId}/approve" method="POST" style="display:inline;">
      <input type="hidden" name="studentsid" value='${JSON.stringify(studentsIds)}'>
      <button type="submit" style="padding: 20px 30px; background-color: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer;">
        ✔️ אשר חיפוש
      </button>
    </form>

<span style="padding: 10px 20px; background-color: #3498db; color: white; border-radius: 5px; display: inline-block;">
  ⏸️ החיפוש מושהה
</span>

    <a href="http://localhost:5173/search-results/${searchId}"
      style="padding: 10px 20px; background-color:rgb(163, 52, 219); color: white; text-decoration: none; border-radius: 5px;">
      📝 ערוך חיפוש
    </a>

    <a href="https://pudium-production.up.railway.app/api/podium/searches/${searchId}/delete"
      style="padding: 10px 20px; background-color: #e74c3c; color: white; text-decoration: none; border-radius: 5px;">
      ❌ מחק חיפוש
    </a>
  </div>
</div>
`;




    /*`
        <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
        <h2 style="color: #2c3e50;">📝 פרטי החיפוש שלך</h2>
        
        <ul style="list-style: none; padding: 0;">
            <li><strong>שם מחפשת:</strong> ${search[0].searchername}</li>
            <li><strong>תחום:</strong> ${search[0].field}</li>
            <li><strong>כיתות:</strong> ${classes}</li>
            <li><strong>כמות תלמידות:</strong> ${search[0].countstudents}</li>
        </ul>

        <h3 style="margin-top: 30px;">👩‍🎓 רשימת תלמידות</h3>
        <table border="1" cellspacing="0" cellpadding="6" style="width: 100%; border-collapse: collapse; background-color: #fff; text-align: right;">
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

        <h3 style="margin-top: 30px;">📩 בחרו פעולה</h3>
        <div style="margin-top: 10px;">
            // <form action="https://pudium-production.up.railway.app/api/podium/searches/18/approve" method="POST">
            // <input type="hidden" name="studentsid" value='${JSON.stringify(studentsIds)}'>
            // <button type="submit"
            //     style="padding: 10px 20px; background-color: #2ecc71; color: white; border: none; border-radius: 5px;">
            //     ✔️ אשר חיפוש
            // </button>
            // </form>

            // <a href="#" onclick="alert('🔕 החיפוש הושהה');"
            // style="padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; margin-left: 10px; border-radius: 5px;">
            // ⏸️ השהה חיפוש
            // </a>
            // <a href="http://localhost:5173/search-results/${searchId}"
            // style="padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; margin-left: 10px; border-radius: 5px;">
            // 📝 ערוך חיפוש
            // </a>
            // <a href="${BASE_URL}/searches/${searchId}/delete"
            // style="padding: 10px 20px; background-color: #e74c3c; color: white; text-decoration: none; margin-left: 10px; border-radius: 5px;">
            // ❌ מחק חיפוש
            // </a>
            
        </div>
        </div>
        `;*/


    await mailer.sendMail(schoolEmail, dataFromClient.subject, html);
  }

}
let searchService = new SearchService();
module.exports = searchService;