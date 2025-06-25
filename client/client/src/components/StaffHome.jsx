import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../config';

const StaffHome = () => {

  const navigate = useNavigate();
  const name = localStorage.getItem('staffName');
  const staffId = localStorage.getItem('staffId');
  const schoolId = localStorage.getItem('schoolId');

  const [showAdminButtons, setShowAdminButtons] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showClassesButton, setShowClassesButton] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}staff/schoolId/${schoolId}/id/${staffId}`
        );

        const confirm = response.data[0]?.confirm;

        if (confirm == 0) {
          setShowAdminButtons(true);
        }
        if (confirm == 3) {
          setShowClassesButton(false);
        }
      } catch (err) {
        console.error('שגיאה בשליפת נתוני אשת צוות:', err);
      } finally {
        setLoading(false);
      }
    };

    if (staffId) fetchStaff();
  }, [staffId, schoolId]);

  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="mt-5 text-center">
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>שלום ל{name}</h2>
        <Button
          onClick={() => navigate('../staff-login')}
          variant="outline-secondary"
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
        >
          חזרה לדף ההתחברות 👉
        </Button>
      </div>

      {showClassesButton && (
        <Button variant="primary" className="m-3" onClick={() => navigate('/classes')}>
          🗂️ מילוי פרטים ✍️ - הצגת כיתות
        </Button>
      )}

      <Button variant="secondary" className="m-3" onClick={() => navigate('/data-fetch')}>
        🔍 שליפת נתונים
      </Button>
      <Button variant="info" className="m-3" onClick={() => navigate('/priority')}>
        ⭐ בחירה ידנית
      </Button>


      {showAdminButtons && (
        <>
          <hr />
          <Button variant="warning" className="m-2" onClick={() => navigate('/staff-manage')}>
            ⚙️ ניהול
          </Button>
        </>
      )}
    </Container>
  );
};

export default StaffHome;
