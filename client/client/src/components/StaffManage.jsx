import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';

const StaffManage = () => {
  const navigate = useNavigate();
  const schoolId = localStorage.getItem('schoolId');

  const handleGoUpGrade = async () => {
    try {
      const response = await axios.get(`https://pudium-production.up.railway.app/api/podium/students/goUpGrade/${schoolId}`);
      alert('כל התלמידות עלו כיתה בהצלחה!');
    } catch (err) {
      console.error('שגיאה בעליית שנה:', err);
      alert('אירעה שגיאה בעת עליית השנה.');
    }
  };

  return (
    <Container className="mt-5 text-center">
      <h2>ניהול בית ספר</h2>

      <Button variant="success" className="m-2" onClick={() => navigate('/staff/add')}>
        ➕ הוספת אשת צוות
      </Button>

      <Button variant="warning" className="m-2" onClick={() => navigate('/staff/edit')}>
        📝 עדכון אשת צוות
      </Button>

      <Button variant="danger" className="m-2" onClick={() => navigate('/staff/delete')}>
        ❌ מחיקת אשת צוות
      </Button>

      <hr />

      <Button variant="info" className="m-2" onClick={handleGoUpGrade}>
        ⬆️ עליית שנה לכל התלמידות
      </Button>

      <Button variant="secondary" className="m-2" onClick={() => navigate('/manage-fields')}>
        🎯 שינוי התחומים שבית הספר מציע
      </Button>
    </Container>
  );
};

export default StaffManage;
