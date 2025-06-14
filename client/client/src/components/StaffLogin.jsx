import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const StaffLogin = () => {
  const [staffCode, setStaffCode] = useState('');
  const [error, setError] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('schoolName');
    if (name) setSchoolName(name);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schoolId = localStorage.getItem('schoolId');
    try {
      const res = await axios.get(`https://pudium-production.up.railway.app/api/podium/staff/schoolId/${schoolId}/id/${staffCode}`);
      const staff = res.data[0];
      localStorage.setItem('staffName', staff.name);
      navigate('/staff-home');
    } catch (err) {
      setError('קוד איש הצוות שגוי');
    }
  };

  const goToStudentForm = () => {
    navigate('/student-form');
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-3">שלום וברוכה הבאה לבית הספר: {schoolName}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="הכניסי קוד איש צוות"
            value={staffCode}
            onChange={(e) => setStaffCode(e.target.value)}
            required
          />
        </Form.Group>
        <div className="text-center mt-3">
          <Button type="submit" variant="success" className="me-2">כניסה כאשת צוות</Button>
          <Button variant="secondary" onClick={goToStudentForm}>כניסה כתלמידה</Button>
        </div>
      </Form>
    </Container>
  );
};

export default StaffLogin;
