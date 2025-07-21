import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

const EditStaff = () => {

  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = הזנת קוד, 2 = טופס עדכון
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [classT, setClassT] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const schoolId = localStorage.getItem('schoolId');
  const inputRef = useRef(null); // יצירת ref לשדה הקלט

  useEffect(() => {
    inputRef.current?.focus(); // קביעת פוקוס אוטומטי כשנטען
  }, []);
  // טען את הנתונים כשהגענו לשלב 2 (טופס עדכון)
  useEffect(() => {
    if (step !== 2) return;
    if (!schoolId || !id) return;

    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${BASE_URL}staff/schoolId/${schoolId}/id/${id}`);
        const staff = res.data[0];
        setName(staff.name || '');
        setConfirm(String(staff.confirm ?? ''));
        setClassT(staff.class || '');
        setError(null);
      } catch (err) {
        setError('שגיאה בטעינת פרטי אשת צוות');
        console.error(err.response?.data);
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
      navigate("/staff-manage");
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
          <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
            <h3>הכנס קוד אשת צוות</h3>
            <Button
              onClick={() => navigate('../staff-manage')}
              variant="outline-secondary"
              style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
            >
              חזרה 👉
            </Button>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleIdSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>קוד אשת צוות</Form.Label>
              <Form.Control
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="הכנס קוד אשת צוות"
                ref={inputRef}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">המשך</Button>
          </Form>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
            <h3>עדכון אשת צוות</h3>
            <Button
              onClick={() => navigate('../staff-manage')}
              variant="outline-secondary"
              style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
            >
              חזרה 👉
            </Button>
          </div>
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
                ref={inputRef}
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
                <option value="0">מנהלת מערכת</option>
                <option value="1">גישה לכל התלמידות</option>
                <option value="2">מחנכת (יש להזין כיתת חינוך)</option>
                <option value="3">עובדת כללית (אין גישה לפרטי התלמידות ועריכתן)</option>
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
