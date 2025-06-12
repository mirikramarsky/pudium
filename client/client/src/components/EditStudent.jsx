import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const EditStudent = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`https://pudium-production.up.railway.app/api/podium/students/`);
        const student = response.data.find(s => s.id === Number(id));
        if (!student) {
          setError('תלמידה לא נמצאה');
          return;
        }
        setFormData(student);
      } catch (err) {
        setError('שגיאה בשליפת תלמידה');
        console.error(err);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`https://pudium-production.up.railway.app/api/podium/students/${id}`, formData);
      alert('עודכן בהצלחה');
      navigate(-1);
    } catch (err) {
      setError('שגיאה בעדכון');
      console.error(err);
    }
  };

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!formData) return <p>טוען...</p>;

  return (
    <Container className="mt-4">
      <h3>עריכת תלמידה - {formData.firstname} {formData.lastname}</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>שם פרטי</Form.Label>
          <Form.Control
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>שם משפחה</Form.Label>
          <Form.Control
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>מספר זהות</Form.Label>
          <Form.Control
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>כיתה</Form.Label>
          <Form.Control
            type="text"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
          />
        </Form.Group>

        {/* הוסף פה שדות נוספים אם רוצים */}

        <Button type="submit" variant="primary">שמור</Button>
      </Form>
    </Container>
  );
};

export default EditStudent;
