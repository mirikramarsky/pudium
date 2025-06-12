import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ClassesList = () => {
  const [classes, setClasses] = useState([]);
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
        // מסננים תלמידות של אותו מוסד
        const students = response.data.filter(s => s.schoolid === Number(schoolId));
        // מוצאים את כל הכיתות בלי כפילויות
        const uniqueClasses = [...new Set(students.map(s => s.grade))];
        setClasses(uniqueClasses);
      } catch (err) {
        setError('שגיאה בשליפת תלמידות');
        console.error(err);
      }
    };

    fetchStudents();
  }, []);

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h3>בחרי כיתה</h3>
      <ListGroup>
        {classes.length === 0 && <ListGroup.Item>אין כיתות להצגה</ListGroup.Item>}
        {classes.map((grade, idx) => (
          <ListGroup.Item
            action
            key={idx}
            onClick={() => navigate(`/class/${encodeURIComponent(grade)}`)}
          >
            כיתה {grade}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default ClassesList;
