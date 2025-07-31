import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../config';
import DeleteStudentModal from './DeleteStudentModal';
const StaffManage = () => {

  const navigate = useNavigate();
  const schoolId = localStorage.getItem('schoolId');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleGoUpGrade = async () => {
    try {
      const response = await axios.get(`${BASE_URL}students/goUpGrade/${schoolId}`);
      alert('השנה נפתחה בהצלחה!');
    } catch (err) {
      console.error('שגיאה בפתיחת שנה:', err);
      alert('אירעה שגיאה בעת פתיחת השנה.');
    }
  };

  return (
    <Container className="mt-5 text-center">
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
        <h2>ניהול בית ספר</h2>
        <Button
          onClick={() => navigate('../staff-home')}
          variant="outline-secondary"
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
        >
          חזרה 👉
        </Button>
      </div>

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
     <Button variant="primary" className="m-2" onClick={() => navigate('/addStudents')}>
        🎒 הוספת תלמידות למערכת
      </Button>
      <Button variant="light" className="m-2" onClick={() => setShowDeleteModal(true)}>
        🎒 מחיקת תלמידה מהמערכת
      </Button>
      {/* <Button variant="dark" className="m-2" onClick={() => navigate('/editStudent')}>
        🎒 עדכון פרטי תלמידה במערכת 
      </Button> */}
      <Button variant="info" className="m-2" onClick={handleGoUpGrade}>
        🎒 פתיחת שנה חדשה
      </Button>

      <Button variant="secondary" className="m-2" onClick={() => navigate('/manage-fields')}>
        🎯 שינוי התחומים שבית הספר מציע
      </Button>
        <DeleteStudentModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      />
    </Container>
  );
};

export default StaffManage;
