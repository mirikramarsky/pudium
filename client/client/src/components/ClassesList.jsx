import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Container, ListGroup, Alert, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

const ClassesList = () => {
  const [classes, setClasses] = useState({});
  const [error, setError] = useState(null);
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const messageRef = useRef(null);
  const location = useLocation();
  const show = location.state?.show || 'student';
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

        // שליפת הכיתות ישירות מהשרת
        const res = await axios.get(`${BASE_URL}students/classes/${schoolId}`);
        const classList = res.data || [];

        groupAndSetClasses(classList);
      } catch (err) {
        console.error(err);
        setError('שגיאה בשליפת נתונים');
        scrollToMessage();
        setLoading(false);
      }
    };

    const groupAndSetClasses = (flatClassList) => {
      const grouped = {};

      flatClassList.forEach((classStr) => {
        let groupKey = '';

        if (classStr.startsWith('יא')) groupKey = 'יא';
        else if (classStr.startsWith('יב')) groupKey = 'יב';
        else groupKey = classStr[0];

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

    const scrollToMessage = () => {
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    fetchClasses();
  }, []);
  const getBackPath = () => {
    console.log(show);
    
    if (show === 'student') return '../staff-home';
    if (show === 'searches') return '../recent-searches';
    return '../staff-home';
  }
  if (error) return (
    <Container className="mt-4" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
        <Button
          onClick={() => navigate(getBackPath())}
          variant="outline-secondary"
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
        >
          חזרה 👉
        </Button>
      </div>
      <div ref={messageRef}><Alert variant="danger">{error}</Alert></div>

    </Container>);
  if (loading) return (
    <Container className="mt-4" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
        <Button
          onClick={() => navigate(getBackPath())}
          variant="outline-secondary"
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
        >
          חזרה 👉
        </Button>
      </div>
      <Alert variant="info">טוען כיתות...</Alert>
    </Container>);
  if (!staff) return null;

  return (
    <Container className="mt-4">
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
        <h3>בחרי כיתה</h3>
        <Button
          onClick={() => navigate(getBackPath())}
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
                        if(show === 'student'){
                          navigate(`/class/${encodeURIComponent(letter)}/${encodeURIComponent(number)}`);
                          return;
                        }
                        else
                          navigate(`/class-searches/${encodeURIComponent(letter)}/${encodeURIComponent(number)}`);
                      } else {
                        alert('על פי הרשאת הגישה שלך, אין באפשרותך להיכנס לכיתה זו. תודה רבה.');
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
