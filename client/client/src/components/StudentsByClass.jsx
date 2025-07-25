import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

const priorityColors = {
  0: '#e0e0e0', // אפור
  1: '#ffffff', // לבן
  2: '#e0f7fa',
  3: '#b2ebf2',
  4: '#80deea',
  5: '#a5d6a7',
  6: '#66bb6a',
  7: '#388e3c',
  8: '#ffd700',
};

const StudentsByClass = () => {
  const [loading, setLoading] = useState(true);
  const { grade, class: className } = useParams();
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true); // התחל טעינה
      const schoolId = localStorage.getItem('schoolId');
      if (!schoolId) {
        setError('קוד מוסד לא נמצא. אנא התחבר מחדש.');
        setLoading(false); // סיים טעינה גם במקרה של שגיאה
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}students/`);
        const filtered = response.data.filter(s =>
          s.schoolid === Number(schoolId) &&
          s.grade === Number(grade) &&
          s.class === className
        );
        setStudents(filtered);
      } catch (err) {
        setError('שגיאה בשליפת תלמידות');
        console.error(err);
      } finally {
        setLoading(false); // תמיד סיים טעינה
      }
    };

    fetchStudents();
  }, [grade, className]);


  const renderLegend = () => (
    <Table bordered size="sm" className="mb-4" style={{ maxWidth: '100%' }}>
      <thead>
        <tr>
          <th colSpan={9} className="text-center">מקרא צבעים לפי עדיפות</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {Object.entries(priorityColors).map(([priority, color]) => (
            <td
              key={priority}
              style={{
                backgroundColor: color,
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#000',
                padding: '10px',
              }}
            >
              {priority} {priority === '0' ? ' - לא מאופשרת' : ''}
            </td>
          ))}
        </tr>
      </tbody>
    </Table>
  );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
        <h3>תלמידות בכיתה {className} {grade}</h3>
        <Button
          onClick={() => navigate('../classes')}
          variant="outline-secondary"
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
        >
          חזרה 👉
        </Button>
      </div>
      {renderLegend()}
      {loading ? (
      <p>טוען תלמידות...</p>
      ) : students.length === 0 ? (
      <p>אין תלמידות בכיתה זו.</p>
      ) : (
      <Table bordered hover>
        <thead>
          <tr>
            <th>מספר זהות</th>
            <th>שם פרטי</th>
            <th>שם משפחה</th>
            <th>כיתה</th>
            <th>תחום 1</th>
            <th>תחום 2</th>
            <th>תחום 3</th>
            <th>תחום 4</th>
            <th>עדיפות חינוכית</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => {
            const rowColor = priorityColors[Number(student.severalpriority)] || '#ffffff';
            const getCellStyle = (priority) => ({
              backgroundColor: priorityColors[priority] || '#ffffff',
            });

            return (
              <tr
                key={student.id}
                style={{ backgroundColor: rowColor, cursor: 'pointer' }}
                onClick={() => navigate(`/edit-student/${student.id}`)}
              >
                <td style={{ backgroundColor: rowColor }}>{student.id}</td>
                <td style={{ backgroundColor: rowColor }}>{student.firstname}</td>
                <td style={{ backgroundColor: rowColor }}>{student.lastname}</td>
                <td style={{ backgroundColor: rowColor }}>{student.class} {student.grade}</td>
                <td style={getCellStyle(student.field1priority)}>{student.field1}</td>
                <td style={getCellStyle(student.field2priority)}>{student.field2}</td>
                <td style={getCellStyle(student.field3priority)}>{student.field3}</td>
                <td style={getCellStyle(student.field4priority)}>{student.field4}</td>
                <td style={getCellStyle(student.field4priority)}>
                  {student.educpriority ? 'כן' : 'לא'}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      )}
    </Container>
  );
};

export default StudentsByClass;
