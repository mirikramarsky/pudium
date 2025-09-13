import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import BASE_URL from '../config';

const StaffLogin = () => {
  const [staffCode, setStaffCode] = useState('');
  const [error, setError] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null); // יצירת ref לשדה הקלט

  useEffect(() => {
    inputRef.current?.focus(); // קביעת פוקוס אוטומטי כשנטען
    const name = localStorage.getItem('schoolName');
    if (name) setSchoolName(name);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schoolId = localStorage.getItem('schoolId');
    try {
      const res = await axios.get(`${BASE_URL}staff/schoolId/${schoolId}/id/${staffCode}`);
      const staff = res.data[0];
      localStorage.setItem('staffName', staff.name);
      localStorage.setItem('staffId', staff.id);
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
      <h2 className="text-center mb-3">שלום וברוכה הבאה ל{schoolName}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="הכניסי קוד איש צוות"
            value={staffCode}
            onChange={(e) => setStaffCode(e.target.value)}
            ref={inputRef}
            required
          />
        </Form.Group>
        <div className="text-center mt-3">
          <Button type="submit" variant="success" className="me-2">כניסה כאשת צוות 🧑‍🏫</Button>
          <Button variant="secondary" onClick={goToStudentForm}>כניסה כתלמידה 👩‍🎓</Button>
        </div>
      </Form>
    </Container>
  );
};

export default StaffLogin;
