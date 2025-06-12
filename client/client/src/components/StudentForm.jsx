import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentForm = () => {
  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    grade: '',
    subject1: '',
    subject2: '',
    subject3: '',
    subject4: '',
    otherSubject4: '',
    school: '',
  });

  const subjects = ['ריקוד', 'שירה', 'אימון מחול', 'מחול', 'עריכה', 'תפאורה', 'אחר'];

  useEffect(() => {
    const savedSchool = localStorage.getItem('school');
    if (savedSchool) {
      setStudent(prev => ({ ...prev, school: savedSchool }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = { ...student };
    if (dataToSend.subject4 !== 'אחר') {
      delete dataToSend.otherSubject4;
    } else {
      dataToSend.subject4 = student.otherSubject4;
    }

    try {
      await axios.post('https://pudium-production.up.railway.app/api/podium/students/', dataToSend);
      alert('התלמידה נוספה בהצלחה!');
      // איפוס הטופס
      setStudent({
        firstName: '',
        lastName: '',
        idNumber: '',
        grade: '',
        subject1: '',
        subject2: '',
        subject3: '',
        subject4: '',
        otherSubject4: '',
        school: student.school || '',
      });
    } catch (error) {
      console.error(error);
      alert('אירעה שגיאה בשליחה');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">טופס פרטי תלמידה</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">שם פרטי</label>
          <input type="text" className="form-control" name="firstName" value={student.firstName} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">שם משפחה</label>
          <input type="text" className="form-control" name="lastName" value={student.lastName} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">מספר זהות</label>
          <input type="text" className="form-control" name="idNumber" value={student.idNumber} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">כיתה</label>
          <input type="text" className="form-control" name="grade" value={student.grade} onChange={handleChange} required />
        </div>

        {[1, 2, 3, 4].map((num) => (
          <div className="mb-3" key={num}>
            <label className="form-label">תחום {num}</label>
            <select className="form-select" name={`subject${num}`} value={student[`subject${num}`]} onChange={handleChange} required>
              <option value="">בחרי תחום</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {num === 4 && student.subject4 === 'אחר' && (
              <input
                type="text"
                className="form-control mt-2"
                name="otherSubject4"
                placeholder="נא לציין תחום אחר"
                value={student.otherSubject4}
                onChange={handleChange}
              />
            )}
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">בית ספר</label>
          <input type="text" className="form-control" name="school" value={student.school} readOnly />
        </div>

        <button type="submit" className="btn btn-primary">שלחי</button>
      </form>
    </div>
  );
};

export default StudentForm;
