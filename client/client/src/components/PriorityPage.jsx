import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';

const PriorityPage = () => {
  const [amount, setAmount] = useState(1);
  const [studentIds, setStudentIds] = useState(['']);
  const [searchName, setSearchName] = useState('');
  const [field, setField] = useState('');
  const [staffName] = useState(localStorage.getItem('staffName') || '');
  const [searcherId] = useState(localStorage.getItem('staffId') || '');
  const [schoolId] = useState(localStorage.getItem('schoolId') || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleAmountChange = (e) => {
    const newAmount = Number(e.target.value);
    setAmount(newAmount);
    setStudentIds(Array.from({ length: newAmount }, (_, i) => studentIds[i] || ''));
  };

  const handleStudentIdChange = (index, value) => {
    const newIds = [...studentIds];
    newIds[index] = value;
    setStudentIds(newIds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchName || studentIds.some(id => !id)) {
      setError('אנא מלא את כל השדות');
      return;
    }
    setError('');
    try {
      // שליפת תלמידות לפי ID
      const uniqueClasses = new Set();
      for (const id of studentIds) {
        const res = await axios.get(`${BASE_URL}students/${id}`);
        const s = res.data;
        if (s && s.class && s.grade !== undefined) {
          uniqueClasses.add(`${s.class}${s.grade}`);
        }
      }

      const classesArray = Array.from(uniqueClasses);

      const searchData = {
        searchname: searchName,
        countstudents: Number(amount),
        field,
        classes: JSON.stringify(classesArray),
        searcherId,
        searchername: staffName,
      };

      // שמירת החיפוש
      const resSave = await axios.post(`${BASE_URL}searches/`, searchData);
      const searchId = resSave.data.id || resSave.data.insertId || resSave.data;

      // שמירת התלמידות
      await axios.post(`${BASE_URL}stuInSea/${searchId}`, {
        studentsid: JSON.stringify(studentIds),
      });

      setSuccess('העדיפות נשמרה בהצלחה!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('שגיאה בשמירה: ' + (err.response?.data || err.message));
    }
  };

  return (
    <Container className="mt-4">
      <h3>בחירת תלמידות ידנית</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="searchName">
          <Form.Label>שם החיפוש</Form.Label>
          <Form.Control
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="amount">
          <Form.Label>כמות תלמידות</Form.Label>
          <Form.Control
            type="number"
            value={amount}
            min={1}
            onChange={handleAmountChange}
          />
        </Form.Group>

        {studentIds.map((id, index) => (
          <Form.Group key={index} className="mb-3" controlId={`studentId-${index}`}>
            <Form.Label>קוד תלמידה {index + 1}</Form.Label>
            <Form.Control
              type="text"
              value={id}
              onChange={(e) => handleStudentIdChange(index, e.target.value)}
              required
            />
          </Form.Group>
        ))}

        <Form.Group className="mb-3" controlId="field">
          <Form.Label>תחום</Form.Label>
          <Form.Control
            type="text"
            value={field}
            onChange={(e) => setField(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          שמור בחירה
        </Button>
      </Form>
    </Container>
  );
};

export default PriorityPage;
