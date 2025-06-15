import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const fieldOptions = [
  'אימון מחול', 'עריכה', 'עיצוב אופנה', 'תפאורה', 'צילום', 'נגינה', 'שירה', 'אחר'
];

const SearchFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    field: '',
    classes: [],
    staffName: localStorage.getItem('staffName') || '',
    schoolId: Number(localStorage.getItem("schoolId")) || 0
  });

  const [classList, setClassList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const schoolId = localStorage.getItem("schoolId");
        if (!schoolId) return;
       const localClasses = localStorage.getItem('classes');
        if (localClasses) {
            setClassList(JSON.parse(localClasses));
        } else {
            axios.get(`https://pudium-production.up.railway.app/api/podium/students/classes/${schoolId}`)
                .then(res => {
                    const classes = res.data || [];
                    localStorage.setItem('classes', JSON.stringify(classes));
                    setClassList(classes);
                })
        }
      } catch (err) {
        console.error(err);
        setError('שגיאה בטעינת כיתות');
      }
    };

    fetchClasses();
  }, []);

  const handleClassToggle = (cls) => {
    setFormData(prev => {
      const exists = prev.classes.includes(cls);
      return {
        ...prev,
        classes: exists ? prev.classes.filter(c => c !== cls) : [...prev.classes, cls]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const searchParams = {
      myField: formData.field,
      schoolId: formData.schoolId,
      classes: formData.classes,
      count: Number(formData.amount)
    };

    try {
      console.log(searchParams);
      const resStudents = await axios.post(
        'https://pudium-production.up.railway.app/api/podium/students/params',
        searchParams
      );

      const foundStudents = resStudents.data;

      const searchData = {
        searchname: formData.name,
        countstudents: foundStudents.length,
        field: formData.field,
        classes: formData.classes,
        searchername: formData.staffName,
        schoolId: formData.schoolId
      };

      const students ={
        studentsid: foundStudents
      }
    

      const resSave = await axios.post(
        'https://pudium-production.up.railway.app/api/podium/searches/',
        searchData
      );
        const saveinstuinsea = await axios.post(
        `https://pudium-production.up.railway.app/api/podium/stuInSea/${formData.schoolId}`,
        students
      );
      // sessionStorage.setItem('lastStudents', JSON.stringify(foundStudents));

      navigate(`/search-results/${resSave.data.id}`);
    } catch (err) {
      console.error(err);
      setError('אירעה שגיאה בעת ביצוע החיפוש או השמירה');
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-between mb-3">
        <Col><h4>טופס חיפוש תלמידות</h4></Col>
        <Col className="text-end">
          <Button onClick={() => navigate('/recent-searches')}>חיפושים אחרונים</Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>שם החיפוש</Form.Label>
          <Form.Control
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>כמות</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>תחום</Form.Label>
          <Form.Select
            value={formData.field}
            onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            required
          >
            <option value="">בחר תחום</option>
            {fieldOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>בחירת כיתות</Form.Label>
          <div className="d-flex flex-wrap gap-3">
            {classList.map(cls => (
              <Form.Check
                key={cls}
                type="checkbox"
                label={cls}
                checked={formData.classes.includes(cls)}
                onChange={() => handleClassToggle(cls)}
              />
            ))}
          </div>
        </Form.Group>

        <Button variant="primary" type="submit">שלח</Button>
      </Form>
    </Container>
  );
};

export default SearchFormPage;
