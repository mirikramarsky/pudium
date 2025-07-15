import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

const SearchFormPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    field: '',
    classes: [],
    staffName: localStorage.getItem('staffName') || '',
    searcherId: localStorage.getItem('staffId') || '',
    schoolId: Number(localStorage.getItem("schoolId")) || 0
  });

  const [fieldOptions, setFieldOptions] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [classesByGroup, setClassesByGroup] = useState({});
  const [error, setError] = useState(null);

  const getGroupKey = (cls) => {
    if (cls.startsWith('יא') || cls.startsWith('יב')) return cls.slice(0, 2);
    return cls.slice(0, 1);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const schoolId = localStorage.getItem("schoolId");
        if (!schoolId) return;

        const lastFetched = Number(localStorage.getItem('classesTimestamp'));
        const now = Date.now();

        let classList = [];
        const localClasses = localStorage.getItem('classes');

        if (localClasses && lastFetched && (now - lastFetched) < 5 * 60 * 1000) {
          classList = JSON.parse(localClasses);
        } else {
          const res = await axios.get(`${BASE_URL}students/classes/${schoolId}`);
          classList = res.data || [];
          localStorage.setItem('classes', JSON.stringify(classList));
          localStorage.setItem('classesTimestamp', now.toString());
        }

        const byGroup = {};
        classList.forEach(cls => {
          const group = getGroupKey(cls);
          if (!byGroup[group]) byGroup[group] = new Set();
          byGroup[group].add(cls);
        });

        setClassesByGroup(byGroup);

        const response = await axios.get(`${BASE_URL}schools/${schoolId}`);
        const schoolFields = JSON.parse(response.data[0]?.fields || []);
        setFieldOptions(schoolFields);

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

  const selectAllInGroup = (group) => {
    const allClasses = Array.from(classesByGroup[group] || []);
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

  const toggleExpanded = (group) => {
    setExpandedGroup(expandedGroup === group ? null : group);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const searchData = {
        searchname: formData.name,
        countstudents: Number(formData.amount),
        field: formData.field,
        classes: formData.classes,
        searcherId: formData.searcherId,
        searchername: formData.staffName,
        schoolid: formData.schoolId
      };
      const resSave = await axios.post(`${BASE_URL}searches/`, searchData);
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
      <Row className="position-relative mb-5 justify-content-center text-center">
        <h4 className="mb-0">טופס חיפוש תלמידות</h4>
        <div className="position-absolute" style={{ right: 0, top: 0 }}>
          <div style={{ width: '160px' }} className="d-flex flex-column align-items-end">
            <Button variant="outline-secondary" onClick={() => navigate('../staff-home')} className="mb-2 w-100">
              חזרה 👉
            </Button>
            <Button variant="outline-primary" onClick={() => navigate('/recent-searches')} className="mb-2 w-100">
              חיפושים אחרונים 🔎
            </Button>
            <Button variant="outline-warning" onClick={() => navigate('/wait-searches')} className="w-100">
              חיפושים מושהים 🔎
            </Button>
          </div>
        </div>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className='pt-5'>
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
            {Object.keys(classesByGroup).sort().map(group => (
              <div key={group} style={{ marginBottom: '5px' }}>
                <Button
                  variant={formData.classes.some(c => getGroupKey(c) === group) ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => selectAllInGroup(group)}
                >
                  {group} {(() => {
                    const allClasses = Array.from(classesByGroup[group]);
                    const allSelected = allClasses.every(c => formData.classes.includes(c));
                    return allSelected ? '✓' : '';
                  })()}
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  style={{ marginLeft: '5px' }}
                  onClick={() => toggleExpanded(group)}
                >
                  {expandedGroup === group ? '▲' : '▼'}
                </Button>
                {expandedGroup === group && (
                  <div style={{ marginTop: '5px', marginLeft: '10px' }}>
                    {Array.from(classesByGroup[group]).sort().map(cls => (
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
