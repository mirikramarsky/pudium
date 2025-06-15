import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ClassesList = () => {
  const [classes, setClasses] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      const schoolId = localStorage.getItem('schoolId');
      if (!schoolId) {
        setError('קוד מוסד לא נמצא. אנא התחבר מחדש.');
        return;
      }

      try {
        const localClasses = localStorage.getItem('classes');
        if (localClasses) {
          const flatClassList = JSON.parse(localClasses);
        } else {
          axios.get(`https://pudium-production.up.railway.app/api/podium/students/classes/${schoolId}`)
            .then(res => {
              const classes = res.data || [];
              localStorage.setItem('classes', JSON.stringify(classes));
              const flatClassList = classes;
            })
        }

        // קיבוץ לפי אות כיתה
        const grouped = {};
        flatClassList.forEach(classStr => {
          const letter = classStr[0]; // למשל 'א'
          if (!grouped[letter]) grouped[letter] = [];
          grouped[letter].push(classStr);
        });

        // מיון פנימי של כל קבוצה לפי מספר
        for (const key in grouped) {
          grouped[key].sort((a, b) => {
            const numA = parseInt(a.slice(1));
            const numB = parseInt(b.slice(1));
            return numA - numB;
          });
        }

        setClasses(grouped);
      } catch (err) {
        setError('שגיאה בשליפת רשימת הכיתות');
        console.error(err);
      }
    };

    fetchClasses();
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
                  onClick={() => {
                    const letter = cls.charAt(0);
                    const number = cls.slice(1);
                    navigate(`/class/${encodeURIComponent(letter)}/${encodeURIComponent(number)}`);
                  }}
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
