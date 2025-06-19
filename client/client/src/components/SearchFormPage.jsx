import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const SearchFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    field: '',
    classes: [],
    staffName: localStorage.getItem('staffName') || '',
    searcherId:localStorage.getItem('staffId') || '',
    schoolId: Number(localStorage.getItem("schoolId")) || 0
  });
  const [fieldOptions, setFieldOptions] = useState([]);
  const [expandedLetter, setExpandedLetter] = useState(null);
  const [classesByLetter, setClassesByLetter] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const schoolId = localStorage.getItem("schoolId");
        if (!schoolId) return;
         const response = await axios.get(`https://pudium-production.up.railway.app/api/podium/schools/${schoolId}`);
        const schoolFields = JSON.parse(response.data[0]?.fields || []);
        setFieldOptions(schoolFields);
        const localClasses = localStorage.getItem('classes');
        let classList = [];

        if (localClasses) {
          classList = JSON.parse(localClasses);
        } else {
          const res = await axios.get(`https://pudium-production.up.railway.app/api/podium/students/classes/${schoolId}`);
          const classes = res.data || [];
          localStorage.setItem('classes', JSON.stringify(classes));
          classList = classes;
        }

        const byLetter = {};
        classList.forEach(cls => {
          const letter = cls.charAt(0);
          if (!byLetter[letter]) byLetter[letter] = new Set();
          byLetter[letter].add(cls);
        });

        setClassesByLetter(byLetter);
      } catch (err) {
        console.error(err);
        setError('שגיאה בטעינת כיתות');
      }
    };

    fetchClasses();
  }, []);

  const toggleClass = (cls) => {
    setFormData(prev => {
      const exists = prev.classes.includes(cls);
      return {
        ...prev,
        classes: exists ? prev.classes.filter(c => c !== cls) : [...prev.classes, cls]
      };
    });
  };

  const selectAllInLetter = (letter) => {
    const allClasses = Array.from(classesByLetter[letter] || []);
    const allSelected = allClasses.every(c => formData.classes.includes(c));
    if (allSelected) {
      setFormData(prev => ({
        ...prev,
        classes: prev.classes.filter(c => !allClasses.includes(c))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        classes: [...new Set([...prev.classes, ...allClasses])]
      }));
    }
  };

  const toggleExpanded = (letter) => {
    setExpandedLetter(expandedLetter === letter ? null : letter);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const searchParams = {
    //   myField: formData.field,
    //   schoolId: formData.schoolId,
    //   classes: formData.classes,
    //   count: Number(formData.amount)
    // };

    try {
      // const resStudents = await axios.post(
      //   'https://pudium-production.up.railway.app/api/podium/students/params',
      //   searchParams
      // );
      // const foundStudents = resStudents.data;

      const searchData = {
        searchname: formData.name,
        countstudents:  Number(formData.amount),
        field: formData.field,
        classes: formData.classes,
        searcherId: formData.searcherId,
        searchername: formData.staffName
      };

      // const studentsIds = foundStudents.map(student => student.id);

      const resSave = await axios.post(
        'https://pudium-production.up.railway.app/api/podium/searches/',
        searchData
      );

      // await axios.post(
      //   `https://pudium-production.up.railway.app/api/podium/stuInSea/${resSave.data.id}`,
      //   { studentsid: studentsIds }
      // );
      // sessionStorage.setItem(`students-${resSave.data.id}`, JSON.stringify(studentsIds));
      sessionStorage.setItem(`search-${resSave.data.id}`, JSON.stringify(searchData));
      await new Promise(resolve => setTimeout(resolve, 200));
      navigate(`/search-results/${resSave.data.id}`);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400 && err.config.url.includes('/students/params')) {
        setError('תלמידות תואמות לחיפוש לא נמצאו');
      } else {
        setError('אירעה שגיאה בעת ביצוע החיפוש או השמירה');
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-between mb-3">
        <Col><h4>טופס חיפוש תלמידות</h4></Col>
        <Col className="text-end">
          <Button onClick={() => navigate('/recent-searches')}>חיפושים אחרונים 🔎</Button>
           <Button variant='secondary' onClick={() => navigate('/wait-searches')}>חיפושים מושהים 🔎</Button>
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
          <Form.Label>כיתה (בחר אות או כיתה מדויקת)</Form.Label>
          <div>
            {Object.keys(classesByLetter).sort().map(letter => (
              <div key={letter} style={{ marginBottom: '5px' }}>
                <Button
                  variant={formData.classes.some(c => c.startsWith(letter)) ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => selectAllInLetter(letter)}
                >
                  {letter} {(() => {
                    const allClasses = Array.from(classesByLetter[letter]);
                    const allSelected = allClasses.every(c => formData.classes.includes(c));
                    return allSelected ? '✓' : '';
                  })()}
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  style={{ marginLeft: '5px' }}
                  onClick={() => toggleExpanded(letter)}
                >
                  {expandedLetter === letter ? '▲' : '▼'}
                </Button>
                {expandedLetter === letter && (
                  <div style={{ marginTop: '5px', marginLeft: '10px' }}>
                    {Array.from(classesByLetter[letter]).sort().map(cls => (
                      <Form.Check
                        key={cls}
                        type="checkbox"
                        id={`chk-${cls}`}
                        label={cls}
                        checked={formData.classes.includes(cls)}
                        onChange={() => toggleClass(cls)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Form.Group>

        <Button variant="primary" type="submit">שלח</Button>
      </Form>
    </Container>
  );
};

export default SearchFormPage;
