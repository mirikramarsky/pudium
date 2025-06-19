import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const SchoolCode = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${BASE_URL}schools/${code}`);
      const school = res.data[0];
      localStorage.setItem('schoolId', code);
      localStorage.setItem('schoolName', school.schoolname);
      navigate('/staff-login');
    } catch (err) {
      setError('קוד המוסד שגוי. אנא נסי שנית.');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">הכניסי סמל מוסד 🏫</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="הכניסי סמל מוסד"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </Form.Group>
        <div className="text-center mt-3">
          <Button type="submit" variant="primary">שלחי</Button>
        </div>
      </Form>
    </Container>
  );
};

export default SchoolCode;
