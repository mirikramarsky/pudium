import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Dropdown, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const fieldOptions = [
  'אימון מחול', 'עריכה', 'עיצוב אופנה', 'תפאורה', 'צילום', 'נגינה', 'שירה', 'אחר'
];

const gradeLabels = ['ט', 'י', 'י"א', 'י"ב'];

const SearchFormPage = () => {
  const navigate = useNavigate();
  const [allStudents, setAllStudents] = useState([]);
  const [gradesMap, setGradesMap] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    field: '',
    grade: '',
    subgrade: '',
    staffName: localStorage.getItem('staffName') || '',
    schoolId: Number(localStorage.getItem("schoolId")) || 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://pudium-production.up.railway.app/api/podium/students/')
      .then(res => {
        setAllStudents(res.data);
        const grouped = {};
        res.data.forEach(s => {
          const g = s.grade;
          if (!grouped[g]) grouped[g] = [];
          grouped[g].push(s);
        });
        setGradesMap(grouped);
      })
      .catch(() => setError('שגיאה בשליפת התלמידות'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mingradeNum = parseInt(formData.subgrade || formData.grade || '0');

    const searchParams = {
      myField: formData.field,
      schoolId: formData.schoolId,
      mingrade: mingradeNum,
      maxgrade: 12,
      count: Number(formData.amount)
    };

    try {
      console.log(searchParams);
      
      const resStudents = await axios.post(
        'https://pudium-production.up.railway.app/api/podium/students/params',
        searchParams
      );
console.log(resStudents);

      const foundStudents = resStudents.data;

      const searchData = {
        searchname: formData.name,
        countstudents: foundStudents.length,
        field: formData.field,
        mingrade: mingradeNum,
        maxgrade: 12,
        searchername: formData.staffName,
        schoolId: formData.schoolId
      };
console.log(searchData);

      const resSave = await axios.post(
        'https://pudium-production.up.railway.app/api/podium/searches/',
        searchData
      );
console.log(resSave);

      // שמירה זמנית של התלמידות
      sessionStorage.setItem('lastStudents', JSON.stringify(foundStudents));

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
          <Form.Label>בחירת כיתה</Form.Label>
          <div className="d-flex gap-3 flex-wrap">
            {gradeLabels.map(gradeLabel => {
              const subgrades = Object.keys(gradesMap).filter(g =>
                g.startsWith(gradeLabel)
              );

              return (
                <Dropdown key={gradeLabel}>
                  <Dropdown.Toggle variant="secondary">{gradeLabel}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {subgrades.length > 0 ? (
                      subgrades.map(g => (
                        <Dropdown.Item
                          key={g}
                          onClick={() => setFormData({ ...formData, grade: gradeLabel, subgrade: g })}
                        >
                          {g}
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item disabled>אין כיתות</Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              );
            })}
          </div>
        </Form.Group>

        <Button variant="primary" type="submit">שלח</Button>
      </Form>
    </Container>
  );
};

export default SearchFormPage;
