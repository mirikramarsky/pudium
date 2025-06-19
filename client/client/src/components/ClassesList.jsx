import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

const ClassesList = () => {
  const [classes, setClasses] = useState({});
  const [error, setError] = useState(null);
  const [staff, setStaff] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchClasses = async () => {
  //     const schoolId = localStorage.getItem('schoolId');
  //     const staffId = localStorage.getItem('staffId');
  //     if (!schoolId) {
  //       setError('קוד מוסד לא נמצא. אנא התחברי מחדש.');
  //       return;
  //     }
  //     if (!staffId) {
  //       setError('קוד אשת צוות לא נמצא. אנא התחברי מחדש.');
  //       return;
  //     }

  //     try {
  //       // שליפת פרטי הצוות
  //       const staffRes = await axios.get(
  //         `${BASE_URL}staff/schoolId/${schoolId}/id/${staffId}`
  //       );
  //       const staffData = staffRes.data[0];
  //       setStaff(staffData);

  //       let flatClassList = [];
  //       const localClasses = localStorage.getItem('classes');
  //       if (localClasses) {
  //         flatClassList = JSON.parse(localClasses);
  //         groupAndSetClasses(flatClassList);
  //       } else {
  //         const res = await axios.get(
  //           `${BASE_URL}students/classes/${schoolId}`
  //         );
  //         const classes = res.data || [];
  //         localStorage.setItem('classes', JSON.stringify(classes));
  //         flatClassList = classes;
  //         groupAndSetClasses(flatClassList);
  //       }
  //     } catch (err) {
  //       setError('שגיאה בשליפת נתונים');
  //       console.error(err);
  //     }
  //   };

  //   const groupAndSetClasses = (flatClassList) => {
  //     const grouped = {};
  //     flatClassList.forEach((classStr) => {
  //       const letter = classStr[0];
  //       if (!grouped[letter]) grouped[letter] = [];
  //       grouped[letter].push(classStr);
  //     });

  //     for (const key in grouped) {
  //       grouped[key].sort((a, b) => {
  //         const numA = parseInt(a.slice(1));
  //         const numB = parseInt(b.slice(1));
  //         return numA - numB;
  //       });
  //     }

  //     setClasses(grouped);
  //   };

  //   fetchClasses();
  // }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      const schoolId = localStorage.getItem('schoolId');
      const staffId = localStorage.getItem('staffId');
      if (!schoolId) {
        setError('קוד מוסד לא נמצא. אנא התחברי מחדש.');
        return;
      }
      if (!staffId) {
        setError('קוד אשת צוות לא נמצא. אנא התחברי מחדש.');
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
        setError('שגיאה בשליפת נתונים');
        console.error(err);
      }
    };

    const groupAndSetClasses = (flatClassList) => {
      const grouped = {};
      flatClassList.forEach((classStr) => {
        const letter = classStr[0];
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(classStr);
      });

      for (const key in grouped) {
        grouped[key].sort((a, b) => {
          const numA = parseInt(a.slice(1));
          const numB = parseInt(b.slice(1));
          return numA - numB;
        });
      }

      setClasses(grouped);
    };

    fetchClasses();
  }, []);


  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!staff) return null;

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
                        const letter = cls.charAt(0);
                        const number = cls.slice(1);
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
    </Container>
  );
};

export default ClassesList;