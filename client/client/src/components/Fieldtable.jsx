import React, { useEffect, useState, useRef } from 'react';
import { Table, Form, Alert, Button, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';

const StudentsFieldsTable = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [fields, setFields] = useState([]);
  const [message, setMessage] = useState({ text: '', variant: '' });
  const [filter, setFilter] = useState({ class: '', firstname: '', lastname: '' });
  const schoolId = localStorage.getItem('schoolId');
  const navigate = useNavigate();
  const typingTimeouts = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsRes = await axios.get(`${BASE_URL}students/${schoolId}`);
        const schoolRes = await axios.get(`${BASE_URL}schools/${schoolId}`);
        const schoolFields = JSON.parse(schoolRes.data[0]?.fields) || [];

        const formattedStudents = studentsRes.data.map((s) => {
          const studentFields = [s.field1, s.field2, s.field3, s.field4];
          const selected = studentFields.filter((f) => schoolFields.includes(f));
          const others = studentFields.filter((f) => !schoolFields.includes(f));

          return {
            ...s,
            selectedFields: [...selected, '', '', '', ''].slice(0, 4),
            otherFields: [...others, '', '', '', ''].slice(0, 4),
          };
        });

        setFields(schoolFields);
        setStudents(formattedStudents);
        setFilteredStudents(formattedStudents);
      } catch (err) {
        console.error('שגיאה בטעינת תלמידות או תחומים:', err);
      }
    };

    fetchData();
  }, [schoolId]);

  const countValidFields = (student) => {
    const allFields = [...student.selectedFields, ...student.otherFields];
    return allFields.filter((f) => f && f.trim() !== '').length;
  };

  const saveStudent = async (student) => {
    const merged = [
      ...student.selectedFields.filter(f => f && f.trim() !== ''),
      ...student.otherFields.filter(f => f && f.trim() !== '')
    ].slice(0, 4);

    try {
      await axios.put(`${BASE_URL}students/${student.id}`, {
        schoolId: Number(schoolId),
        field1: merged[0] || '',
        field2: merged[1] || '',
        field3: merged[2] || '',
        field4: merged[3] || '',
      });
      setMessage({
        text: `נשמר בהצלחה לתלמידה ${student.firstname} ${student.lastname}`,
        variant: 'success',
      });
    } catch (err) {
      console.error('שגיאה בשמירה:', err);
    }
  };

  const handleCheckboxChange = (studentIndex, fieldName) => {
    setStudents((prev) => {
      const updated = [...prev];
      const student = { ...updated[studentIndex] };
      const totalSelected = countValidFields(student);

      if (student.selectedFields.includes(fieldName)) {
        const idx = student.selectedFields.indexOf(fieldName);
        student.selectedFields[idx] = '';
      } else {
        if (totalSelected >= 4) {
          setMessage({
            text: 'לא ניתן לבחור יותר מ-4 תחומים (כולל "אחר")',
            variant: 'danger',
          });
          return prev;
        }

        const emptyIndex = student.selectedFields.findIndex((f) => f === '');
        if (emptyIndex !== -1) {
          student.selectedFields[emptyIndex] = fieldName;
        }
      }

      updated[studentIndex] = student;
      saveStudent(student);
      filterStudents(updated, filter);
      return updated;
    });
  };

  const handleOtherChange = (studentIndex, otherIndex, value) => {
    setStudents((prev) => {
      const updated = [...prev];
      const student = { ...updated[studentIndex] };
      student.otherFields[otherIndex] = value;
      updated[studentIndex] = student;

      clearTimeout(typingTimeouts.current[student.id]);
      typingTimeouts.current[student.id] = setTimeout(() => {
        const totalSelected = countValidFields(student);
        if (totalSelected > 4) {
          setMessage({
            text: 'לא ניתן לבחור יותר מ-4 תחומים (כולל "אחר")',
            variant: 'danger',
          });
          return;
        }
        saveStudent(student);
      }, 600);

      filterStudents(updated, filter);
      return updated;
    });
  };

  // ✅ פונקציית סינון
  const filterStudents = (allStudents, filters) => {
    const filtered = allStudents.filter((s) => {
      const className = (s.class + s.grade).toLowerCase();
      const first = s.firstname.toLowerCase();
      const last = s.lastname.toLowerCase();
      return (
        (!filters.class || className.includes(filters.class.toLowerCase())) &&
        (!filters.firstname || first.includes(filters.firstname.toLowerCase())) &&
        (!filters.lastname || last.includes(filters.lastname.toLowerCase()))
      );
    });
    setFilteredStudents(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filter, [name]: value };
    setFilter(newFilters);
    filterStudents(students, newFilters);
  };

  // אוסף רשימת כל הכיתות הקיימות
  const uniqueClasses = [...new Set(students.map(s => s.class + s.grade))].filter(Boolean);

  return (
    <div>
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
        <h2>טבלת תחומי התלמידות</h2>
        <Button
          onClick={() => navigate('../staff-manage')}
          variant="outline-secondary"
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
        >
          חזרה 👉
        </Button>
      </div>

      {/* 🔍 אזור סינון */}
      <Container className="mb-4 border p-3 rounded bg-light">
        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>כיתה</Form.Label>
              <Form.Select name="class" value={filter.class} onChange={handleFilterChange}>
                <option value="">הצג הכול</option>
                {uniqueClasses.map((cls, i) => (
                  <option key={i} value={cls}>{cls}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>שם פרטי</Form.Label>
              <Form.Control
                type="text"
                name="firstname"
                value={filter.firstname}
                onChange={handleFilterChange}
                placeholder="חיפוש לפי שם פרטי"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>שם משפחה</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                value={filter.lastname}
                onChange={handleFilterChange}
                placeholder="חיפוש לפי שם משפחה"
              />
            </Form.Group>
          </Col>
        </Row>
      </Container>

      {message.text && <Alert variant={message.variant}>{message.text}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ת"ז</th>
            <th>שם פרטי</th>
            <th>שם משפחה</th>
            <th>כיתה</th>
            {fields.map((f, idx) => (
              <th key={idx}>{f}</th>
            ))}
            {[0, 1, 2, 3].map((_, idx) => (
              <th key={idx}>אחר {idx + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, si) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.firstname}</td>
              <td>{student.lastname}</td>
              <td>{student.class + student.grade}</td>
              {fields.map((field, fi) => (
                <td key={fi}>
                  <Form.Check
                    type="checkbox"
                    checked={student.selectedFields.includes(field)}
                    onChange={() => handleCheckboxChange(si, field)}
                  />
                </td>
              ))}
              {[0, 1, 2, 3].map((oi) => (
                <td key={oi} style={{ minWidth: '150px' }}>
                  <Form.Control
                    type="text"
                    value={student.otherFields[oi] || ''}
                    onChange={(e) => handleOtherChange(si, oi, e.target.value)}
                    placeholder="-"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StudentsFieldsTable;
