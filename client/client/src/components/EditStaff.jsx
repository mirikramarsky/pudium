import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditStaff = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = הזנת קוד, 2 = טופס עדכון
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [classT, setClassT] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const schoolId = localStorage.getItem('schoolId');

  // טען את הנתונים כשהגענו לשלב 2 (טופס עדכון)
  useEffect(() => {
    if (step !== 2) return;
    if (!schoolId || !id) return;

    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${BASE_URL}schoolId/${schoolId}/id/${id}`);
        const staff = res.data[0];
        
        setName(staff.name || '');
        setConfirm(String(staff.confirm ?? ''));
        setClassT(staff.class || '');
        setError(null);
      } catch (err) {
        setError('שגיאה בטעינת פרטי אשת צוות');
        console.error(err);
      }
    };

    fetchStaff();
  }, [step, schoolId, id]);

  const handleIdSubmit = (e) => {
    e.preventDefault();
    if (!id) {
      setError('יש להכניס קוד אשת צוות');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}staff/${id}`, {
        name,
        class: classT,
        confirm: Number(confirm),
      });
      setSuccess(true);
      setError(null);
      navigate('/staff-home')
    } catch (err) {
      setError('שגיאה בעדכון אשת צוות');
      setSuccess(false);
      console.error(err);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      {step === 1 && (
        <>
          <h3>הכנס קוד אשת צוות</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleIdSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>קוד אשת צוות</Form.Label>
              <Form.Control
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="הכנס קוד אשת צוות"
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">המשך</Button>
          </Form>
        </>
      )}

      {step === 2 && (
        <>
          <h3>עדכון אשת צוות</h3>
          {success && <Alert variant="success">עודכן בהצלחה</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>מזהה אשת צוות</Form.Label>
              <Form.Control value={id} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>שם</Form.Label>
              <Form.Control
              placeholder={name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>הרשאת גישה</Form.Label>
              <Form.Select
                placeholder={confirm}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              >
                <option value="">בחר הרשאה</option>
                <option value="0">0 - מנהלת מערכת</option>
                <option value="1">1 - גישה לכל התלמידות</option>
                <option value="2">2 - למחנכת (יש להזין כיתת חינוך)</option>
                <option value="3">3 - עובדת כללית (אין גישה לפרטי התלמידות ועריכתן)</option>
              </Form.Select>
            </Form.Group>

            {confirm === '2' && (
              <Form.Group className="mb-3">
                <Form.Label>כיתת חינוך</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={classT || "כיתה"}
                  value={classT}
                  onChange={(e) => setClassT(e.target.value)}
                  required={confirm === '2'}
                />
              </Form.Group>
            )}

            <Button type="submit" variant="primary">עדכן</Button>
          </Form>
        </>
      )}
    </Container>
  );
};

export default EditStaff;
