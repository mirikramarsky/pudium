import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

const DeleteStaff = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      const schoolId = localStorage.getItem('schoolId')
      await axios.delete(`${BASE_URL}staff/${id}`, {
        data: { schoolId }
      });
      setSuccess(true);
      setError(null);
      navigate('/staff-home')
    } catch (err) {
      setError('שגיאה במחיקת אשת צוות');
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
        <h3>מחיקת אשת צוות</h3>
        <Button
          onClick={() => navigate('../staff-manage')}
          variant="outline-secondary"
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
        >
          חזרה 👉
        </Button>
      </div>
      {success && <Alert variant="success">נמחק בהצלחה</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
        <Form.Group className="mb-3">
          <Form.Label>מזהה אשת צוות למחיקה</Form.Label>
          <Form.Control value={id} onChange={(e) => setId(e.target.value)} required />
        </Form.Group>
        <Button type="submit" variant="danger">מחק</Button>
      </Form>
    </Container>
  );
};

export default DeleteStaff;
