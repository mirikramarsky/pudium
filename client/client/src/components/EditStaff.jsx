import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

const EditStaff = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const schoolId = localStorage.getItem('schoolId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://pudium-production.up.railway.app/api/podium/staff/${id}`, {
        name,
        schoolid: Number(schoolId),
        confirm: Number(confirm),
      });
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError('שגיאה בעדכון אשת צוות');
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <h3>עדכון אשת צוות</h3>
      {success && <Alert variant="success">עודכן בהצלחה</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>מזהה אשת צוות</Form.Label>
          <Form.Control value={id} onChange={(e) => setId(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>שם</Form.Label>
          <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm (0 או 1)</Form.Label>
          <Form.Control
            type="number"
            min="0"
            max="1"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">עדכן</Button>
      </Form>
    </Container>
  );
};

export default EditStaff;
