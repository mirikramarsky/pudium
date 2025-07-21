import React, { useEffect, useRef, useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';

const PriorityPage = () => {
  const [searchName, setSearchName] = useState('');
  const [fieldOptions, setFieldOptions] = useState([]);
  const [field, setField] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [grade, setGrade] = useState('');
  const [foundStudents, setFoundStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [staffName] = useState(localStorage.getItem('staffName') || '');
  const [searcherId] = useState(localStorage.getItem('staffId') || '');
  const [schoolId] = useState(localStorage.getItem('schoolId') || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null); // יצירת ref לשדה הקלט

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        inputRef.current?.focus(); // קביעת פוקוס אוטומטי כשנטען

        const schoolId = localStorage.getItem("schoolId");
        if (!schoolId) return;
        const response = await axios.get(`${BASE_URL}schools/${schoolId}`);
        const schoolFields = JSON.parse(response.data[0]?.fields || []);
        setFieldOptions(schoolFields);
      } catch (err) {
        console.error(err);
        setError('שגיאה בטעינת התחומים');
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (lastName.trim()) {
        handleSearch();
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [lastName, firstName, studentClass, grade]);

  const handleSearch = async () => {
    setError('');
    try {
      const query = `${BASE_URL}students/lastname/${schoolId}`;
      const res = await axios.post(query, { lastname: lastName.trim() });
      let students = res.data;

      if (firstName.trim()) {
        students = students.filter(s => s.firstname && s.firstname.includes(firstName.trim()));
      }
      if (studentClass.trim()) {
        students = students.filter(s => s.class && s.class === studentClass.trim());
      }
      if (grade.trim()) {
        students = students.filter(s => s.grade && s.grade === grade.trim());
      }

      const filtered = students.filter(s => !selectedStudents.some(sel => sel.id === s.id));
      setFoundStudents(filtered);
    } catch (err) {
      if (err.status == 404)
        setError('שם המשפחה אינו קיים')
      setError('שגיאה בשליפת תלמידות: ' + (err.response?.data || err.message));
    }
  };

  const addStudent = (student) => {
    setSelectedStudents(prev => [...prev, student]);
    setFoundStudents(prev => prev.filter(s => s.id !== student.id));
    setFirstName('');
    setLastName('');
    setStudentClass('');
    setGrade('');
  };

  const removeStudent = (id) => {
    const student = selectedStudents.find(s => s.id === id);
    if (student) {
      setFoundStudents(prev => [...prev, student]);
    }
    setSelectedStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchName || selectedStudents.length === 0) {
      setError('יש למלא שם חיפוש ולבחור תלמידות');
      return;
    }
    try {
      const uniqueClasses = new Set();
      for (const student of selectedStudents) {
        const res = await axios.post(`${BASE_URL}students/schoolid/${student.id}`, { schoolId });
        const s = res.data;
        if (s && s.class && s.grade !== undefined) {
          uniqueClasses.add(`${s.class}${s.grade}`);
        }
      }

      const classesArray = Array.from(uniqueClasses);

      const searchData = {
        searchname: searchName,
        countstudents: selectedStudents.length,
        field,
        classes: JSON.stringify(classesArray),
        searcherId,
        searchername: staffName,
      };

      const resSave = await axios.post(`${BASE_URL}searches/`, searchData);
      const searchId = resSave.data.id || resSave.data.insertId || resSave.data;

      await axios.post(`${BASE_URL}stuInSea/${searchId}`, {
        studentsid: JSON.stringify(selectedStudents.map(s => s.id)),
      });

      setSuccess('הבחירה נשמרה בהצלחה!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('שגיאה בשמירה: ' + (err.response?.data || err.message));
    }
  };

  return (
    <Container className="mt-4">
      <div style={{ textAlign: 'right' }}>
        <Button variant="outline-secondary" onClick={() => navigate('../staff-home')}>
          חזרה 👉
        </Button>
      </div>
      <h3>בחירת תלמידות ידנית לפי סינון</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>שם החיפוש</Form.Label>
          <Form.Control
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            ref={inputRef}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>תחום</Form.Label>
          <Form.Select
            value={field}
            onChange={(e) => setField(e.target.value)}
          >
            <option value="">בחרי תחום</option>
            {fieldOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <h5>סינון תלמידות</h5>
        <Form.Group className="mb-3">
          <Form.Label>שם פרטי</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>שם משפחה</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>כיתה</Form.Label>
          <Form.Control
            type="text"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>שכבה (ט'-י"ב)</Form.Label>
          <Form.Control
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </Form.Group>

        {foundStudents.length > 0 && (
          <>
            <h5>תלמידות זמינות</h5>
            <Row>
              {foundStudents.map((s) => (
                <Col xs={6} md={4} lg={3} key={s.id} className="mb-2">
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => addStudent(s)}
                  >
                    {s.firstname} {s.lastname} ({s.class}{s.grade})
                  </Button>
                </Col>
              ))}
            </Row>
          </>
        )}

        {selectedStudents.length > 0 && (
          <>
            <h5>תלמידות שנבחרו</h5>
            <Row>
              {selectedStudents.map((s) => (
                <Col xs={12} md={6} lg={4} key={s.id} className="mb-2">
                  <div className="d-flex align-items-center justify-content-between border p-2 rounded">
                    <span>
                      <strong>{s.firstname} {s.lastname}</strong> ({s.class}{s.grade})
                    </span>
                    <Button variant="danger" size="sm" onClick={() => removeStudent(s.id)}>הסרה</Button>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}

        <div className="mt-4">
          <Button variant="primary" type="submit">
            שמור בחירה
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default PriorityPage;
