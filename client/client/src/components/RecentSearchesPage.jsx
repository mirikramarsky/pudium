import React, { useEffect, useState } from 'react';
import { Container, Form, Row, Col, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const fieldOptions = ['אימון מחול', 'עריכה', 'עיצוב אופנה', 'תפאורה', 'צילום', 'נגינה', 'שירה', 'אחר'];

const RecentSearchesPage = () => {
  const navigate = useNavigate();

  const [searches, setSearches] = useState([]);
  const [filteredSearches, setFilteredSearches] = useState([]);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    searchname: '',
    searchername: '',
    field: '',
    countstudents: '',
    classes: [],
  });

  const [classesList, setClassesList] = useState([]);
  const [classesByLetter, setClassesByLetter] = useState({});
  const [expandedLetter, setExpandedLetter] = useState(null);

  // שליפת כיתות מהשרת לפי schoolId
  useEffect(() => {
    const fetchClasses = async () => {
      const schoolId = localStorage.getItem('schoolId');
      if (!schoolId) return;
      try {
      const localClasses = localStorage.getItem('classes');
        if (localClasses) {
            setClassesList(JSON.parse(localClasses));
        } else {
            axios.get(`https://pudium-production.up.railway.app/api/podium/students/classes/${schoolId}`)
                .then(res => {
                    const classes = res.data || [];
                    localStorage.setItem('classes', JSON.stringify(classes));
                    setClassesList(classes);
                })
        }

        // סידור לפי אות
        const byLetter = {};
        classesList.forEach(cls => {
          const letter = cls.charAt(0);
          if (!byLetter[letter]) byLetter[letter] = new Set();
          byLetter[letter].add(cls);
        });
        setClassesByLetter(byLetter);
      } catch (err) {
        setError('שגיאה בטעינת הכיתות');
      }
    };
    fetchClasses();
  }, []);

  // שליפת כל החיפושים
  useEffect(() => {
    axios.get('https://pudium-production.up.railway.app/api/podium/searches/')
      .then(res => {
        const sorted = [...res.data].sort((a, b) => new Date(b.searchdate) - new Date(a.searchdate));
        setSearches(sorted);
        setFilteredSearches(sorted);
      })
      .catch(() => setError('שגיאה בטעינת החיפושים'));
  }, []);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const isSimilar = (a, b) => {
    if (!a || !b) return false;
    const aNorm = a.toLowerCase();
    const bNorm = b.toLowerCase();
    return (
      aNorm === bNorm ||
      aNorm.includes(bNorm) ||
      bNorm.includes(aNorm) ||
      aNorm.startsWith(bNorm) ||
      bNorm.startsWith(aNorm)
    );
  };

  const toggleExpanded = (letter) => {
    setExpandedLetter(expandedLetter === letter ? null : letter);
  };

  const toggleClassSelection = (cls) => {
    if (filters.classes.includes(cls)) {
      updateFilter('classes', filters.classes.filter(c => c !== cls));
    } else {
      updateFilter('classes', [...filters.classes, cls]);
    }
  };

  const selectAllInLetter = (letter) => {
    const allClasses = Array.from(classesByLetter[letter] || []);
    const allSelected = allClasses.every(c => filters.classes.includes(c));
    if (allSelected) {
      updateFilter('classes', filters.classes.filter(c => !allClasses.includes(c)));
    } else {
      const newSelection = [...filters.classes];
      allClasses.forEach(c => {
        if (!newSelection.includes(c)) newSelection.push(c);
      });
      updateFilter('classes', newSelection);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    let results = [...searches];

    if (filters.searchname)
      results = results.filter(s => isSimilar(s.searchname, filters.searchname));

    if (filters.searchername)
      results = results.filter(s => isSimilar(s.searchername, filters.searchername));

    if (filters.field && filters.field !== "other") {
      results = results.filter(s => s.field === filters.field);
    } else if (filters.field === "other") {
      results = results.filter(s => !fieldOptions.includes(s.field));
    }

    if (filters.countstudents)
      results = results.filter(s => Number(s.countstudents) === Number(filters.countstudents));

    // סינון לפי חפיפה בין filters.classes לבין search.classes
    if (filters.classes.length > 0) {
      results = results.filter(search => {
        if (!search.classes || !Array.isArray(search.classes)) return false;
        return search.classes.some(cls => filters.classes.includes(cls));
      });
    }

    setFilteredSearches(results);
  };

  return (
    <Container className="mt-4">
      <h4 className="mb-4">חיפושים אחרונים</h4>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form className="mb-4" onSubmit={handleFilter}>
        <Row className="g-3">
          <Col md={3}>
            <Form.Label>שם החיפוש</Form.Label>
            <Form.Control
              type="text"
              value={filters.searchname}
              onChange={(e) => updateFilter('searchname', e.target.value)}
            />
          </Col>

          <Col md={3}>
            <Form.Label>שם מחפשת</Form.Label>
            <Form.Control
              type="text"
              value={filters.searchername}
              onChange={(e) => updateFilter('searchername', e.target.value)}
            />
          </Col>

          <Col md={3}>
            <Form.Label>תחום</Form.Label>
            <Form.Select
              value={filters.field}
              onChange={(e) => updateFilter('field', e.target.value)}
            >
              <option value="">בחר תחום</option>
              {fieldOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
              <option value="other">אחר</option>
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Label>כיתה (בחר אות או כיתה מדויקת)</Form.Label>
            <div>
              {Object.keys(classesByLetter).sort().map(letter => (
                <div key={letter} style={{ marginBottom: '5px' }}>
                  <Button
                    variant={filters.classes.some(c => c.startsWith(letter)) ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => selectAllInLetter(letter)}
                  >
                    {letter} {(() => {
                      const allClasses = Array.from(classesByLetter[letter]);
                      const allSelected = allClasses.every(c => filters.classes.includes(c));
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
                          checked={filters.classes.includes(cls)}
                          onChange={() => toggleClassSelection(cls)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Col>

          <Col md={2}>
            <Form.Label>כמות</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={filters.countstudents}
              onChange={(e) => updateFilter('countstudents', e.target.value)}
            />
          </Col>

          <Col md={2} className="d-flex align-items-end">
            <Button type="submit" variant="primary">סנן</Button>
          </Col>
        </Row>
      </Form>

      {filteredSearches.length === 0 ? (
        <p>לא נמצאו חיפושים תואמים</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>שם החיפוש</th>
              <th>מחפשת</th>
              <th>תחום</th>
              <th>כיתות</th>
              <th>כמות</th>
              <th>תאריך</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredSearches.map(search => (
              <tr key={search.id}>
                <td>{search.searchname}</td>
                <td>{search.searchername}</td>
                <td>{search.field}</td>
                <td>{(search.classes || []).join(', ')}</td>
                <td>{search.countstudents}</td>
                <td>{new Date(search.createdAt).toLocaleString('he-IL')}</td>
                <td>
                  <Button variant="outline-primary" size="sm" onClick={() => navigate(`/search-results/${search.id}`)}>
                    צפייה
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default RecentSearchesPage;
