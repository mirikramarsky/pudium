import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Container, ListGroup, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

const ClassesList = () => {
  const [classes, setClasses] = useState({});
  const [error, setError] = useState(null);
  const [staff, setStaff] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
const messageRef = useRef(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      const schoolId = localStorage.getItem('schoolId');
      const staffId = localStorage.getItem('staffId');
      if (!schoolId) {
        setError('קוד מוסד לא נמצא. אנא התחברי מחדש.');
        scrollToMessage();
        return;
      }
      if (!staffId) {
        setError('קוד אשת צוות לא נמצא. אנא התחברי מחדש.');
        scrollToMessage();
        return;
      }

      try {
        // שליפת פרטי הצוות
        const staffRes = await axios.get(
          `${BASE_URL}staff/schoolId/${schoolId}/id/${staffId}`
        );
        const staffData = staffRes.data[0];
        setStaff(staffData);

        // בדיקה האם להביא מחדש את הכיתות
        const lastUpdated = localStorage.getItem('classes_lastUpdated');
        const now = Date.now();
        const FIVE_MIN = 5 * 60 * 1000;

        let flatClassList = [];

        if (
          !lastUpdated ||
          now - parseInt(lastUpdated) > FIVE_MIN ||
          !localStorage.getItem('classes')
        ) {
          // אם אין classes או עברו יותר מ־5 דקות – שלוף מהשרת
          const res = await axios.get(`${BASE_URL}students/classes/${schoolId}`);
          const classes = res.data || [];
          localStorage.setItem('classes', JSON.stringify(classes));
          localStorage.setItem('classes_lastUpdated', now.toString());
          flatClassList = classes;
        } else {
          // טען מה־localStorage
          flatClassList = JSON.parse(localStorage.getItem('classes'));
        }

        groupAndSetClasses(flatClassList);

      } catch (err) {
        setLoading(false);
        setError('שגיאה בשליפת נתונים');
        scrollToMessage();
        console.error(err);
      }
    };

    const groupAndSetClasses = (flatClassList) => {
      const grouped = {};
      flatClassList.forEach((classStr) => {
        let groupKey = '';

        if (classStr.startsWith('יא')) {
          groupKey = 'יא';
        } else if (classStr.startsWith('יב')) {
          groupKey = 'יב';
        } else {
          groupKey = classStr[0];
        }

        if (!grouped[groupKey]) grouped[groupKey] = [];
        grouped[groupKey].push(classStr);
      });

      for (const key in grouped) {
        grouped[key].sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, ''));
          const numB = parseInt(b.replace(/\D/g, ''));
          return numA - numB;
        });
      }

      setClasses(grouped);
      setLoading(false);

    };


    fetchClasses();
  }, []);
const scrollToMessage = () => {
    if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
};

  if (error) return <div ref={messageRef}><Alert variant="danger">{error}</Alert></div>;
  if (loading) return <Alert variant="info">טוען כיתות...</Alert>;
  if (!staff) return null;


  return (
    <Container className="mt-4">
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
        <h3>בחרי כיתה</h3>
        <Button
          onClick={() => navigate('../staff-home')}
          variant="outline-secondary"
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
        >
          חזרה 👉
        </Button>
      </div>
      {Object.keys(classes).length === 0 ? (
        <Alert variant="info">אין כיתות להצגה</Alert>
      ) : (
        Object.entries(classes).map(([hebrewLetter, classList]) => (
          <div key={hebrewLetter} className="mb-3">
            <h5>כיתה {hebrewLetter}</h5>
            <ListGroup>
              {classList.map((cls) => {
                const isAllowed =
                  Number(staff.confirm) === 0 ||
                  Number(staff.confirm) === 1 ||
                  (Number(staff.confirm) === 2 && cls === staff.class);

                return (
                  <ListGroup.Item
                    action
                    key={cls}
                    onClick={() => {
                      if (isAllowed) {
                        let letter = '';
                        let number = '';
                        console.log(letter);
                        if (cls.startsWith('יא')) {
                          letter = 'יא';
                          number = cls.slice(2);
                        } else if (cls.startsWith('יב')) {
                          letter = 'יב';
                          number = cls.slice(2);
                        } else {
                          letter = cls.charAt(0);
                          number = cls.slice(1);
                        }

                        navigate(`/class/${encodeURIComponent(letter)}/${encodeURIComponent(number)}`);
                      } else {
                        alert('על פי הרשאת הגישה שלך, אין באפשרותך להכנס לכיתה זו. תודה רבה.');
                      }
                    }}
                  >
                    {cls}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        ))
      )}
    </Container >
  );
};

export default ClassesList;