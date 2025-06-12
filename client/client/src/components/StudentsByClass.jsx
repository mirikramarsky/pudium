import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

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
  const { grade } = useParams();
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      const schoolId = localStorage.getItem('schoolId');
      if (!schoolId) {
        setError('קוד מוסד לא נמצא. אנא התחבר מחדש.');
        return;
      }

      try {
        const response = await axios.get(`https://pudium-production.up.railway.app/api/podium/students/`);
        const filtered = response.data.filter(s => s.schoolid === Number(schoolId) && s.grade === Number(grade));
        setStudents(filtered);
      } catch (err) {
        setError('שגיאה בשליפת תלמידות');
        console.error(err);
      }
    };

    fetchStudents();
  }, [grade]);

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
              color: priority === '0' ? '#000' : '#000',
              padding: '10px',
            }}
          >
            {priority}  {priority === '0' ? ' - לא מאופשרת' : ``}
          </td>
        ))}
      </tr>
    </tbody>
  </Table>
);


  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h3>תלמידות בכיתה {grade}</h3>
      {renderLegend()}
      {students.length === 0 ? (
        <p>אין תלמידות בכיתה זו.</p>
      ) : (
        <Table bordered hover>
          <thead>
            <tr>
              <th>פעולות</th>
              <th>תחום 4</th>
              <th>תחום 3</th>
              <th>תחום 2</th>
              <th>תחום 1</th>
              <th>שם פרטי</th>
              <th>שם משפחה</th>
              <th>מספר זהות</th>
              <th>כיתה</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const rowColor = priorityColors[student.severalPriority] || '#ffffff';

              return (
                <tr key={student.id} style={{ backgroundColor: rowColor }}>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => navigate(`/edit-student/${student.id}`)}>
                      ערוך
                    </Button>
                  </td>
                  <td style={{ backgroundColor: priorityColors[student.field4priority] || '#ffffff' }}>{student.field4}</td>
                  <td style={{ backgroundColor: priorityColors[student.field3priority] || '#ffffff' }}>{student.field3}</td>
                  <td style={{ backgroundColor: priorityColors[student.field2priority] || '#ffffff' }}>{student.field2}</td>
                  <td style={{ backgroundColor: priorityColors[student.field1priority] || '#ffffff' }}>{student.field1}</td>
                  <td>{student.firstname}</td>
                  <td>{student.lastname}</td>
                  <td>{student.id}</td>
                  <td>{student.grade}</td>
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
