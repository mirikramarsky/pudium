import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const StaffHome = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem('staffName');
  const staffId = localStorage.getItem('staffId');
  const schoolId = localStorage.getItem('schoolId');
  console.log(staffId);
  
  const [showAdminButtons, setShowAdminButtons] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(
          `https://pudium-production.up.railway.app/api/podium/staff/schoolId/${schoolId}/id/${staffId}`
        );
        console.log(response.data[0].confirm);
        
        if (response.data[0].confirm == 0) {
          setShowAdminButtons(true);
        }
      } catch (err) {
        console.error('שגיאה בשליפת נתוני אשת צוות:', err);
      } finally {
        setLoading(false);
      }
    };

    if (staffId) fetchStaff();
  }, [staffId]);

  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="mt-5 text-center">
      <h2>שלום ל{name}</h2>

      <Button variant="primary" className="m-3" onClick={() => navigate('/classes')}>
        מילוי פרטים - הצגת כיתות
      </Button>

      <Button variant="secondary" className="m-3" onClick={() => navigate('/data-fetch')}>
        שליפת נתונים
      </Button>

      {showAdminButtons && (
        <>
          <hr />
          <Button variant="success" className="m-2" onClick={() => navigate('/staff/add')}>
            ➕ הוספת אשת צוות
          </Button>
          <Button variant="warning" className="m-2" onClick={() => navigate('/staff/edit')}>
            📝 עדכון אשת צוות
          </Button>
          <Button variant="danger" className="m-2" onClick={() => navigate('/staff/delete')}>
            ❌ מחיקת אשת צוות
          </Button>
        </>
      )}
    </Container>
  );
};

export default StaffHome;
