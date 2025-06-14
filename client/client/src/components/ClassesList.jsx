import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ClassesList = () => {
  const [classes, setClasses] = useState({});
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
        const students = response.data.filter(s => s.schoolid === Number(schoolId));

        // שליפת כל האותיות שיש בפועל מהתלמידות
        const classGroups = {};

        students.forEach(s => {
          const letter = s.class; // עכשיו בעברית: 'א', 'ב', ...
          const grade = s.grade;

          if (!classGroups[letter]) classGroups[letter] = new Set();
          classGroups[letter].add(grade);
        });

        // הפיכת סטים למערכים ממיינים
        const classesByHebrew = {};
        for (const [letter, gradesSet] of Object.entries(classGroups)) {
          const gradesArray = Array.from(gradesSet).sort((a, b) => a - b);
          classesByHebrew[letter] = gradesArray.map(g => `${letter}${g}`);
        }

        setClasses(classesByHebrew);
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
      {Object.keys(classes).length === 0 ? (
        <Alert variant="info">אין כיתות להצגה</Alert>
      ) : (
        Object.entries(classes).map(([hebrewLetter, classList]) => (
          <div key={hebrewLetter} className="mb-3">
            <h5>כיתה {hebrewLetter}</h5>
            <ListGroup>
              {classList.map((cls) => (
                <ListGroup.Item
                  action
                  key={cls}
                  onClick={() => navigate(`/class/${encodeURIComponent(cls)}`)}
                >
                  {cls}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        ))
      )}
    </Container>
  );
};

export default ClassesList;
