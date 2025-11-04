import React, { useEffect, useState } from 'react';
import { Container, Form, Row, Col, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

const RecentSearchesPage = () => {

  const navigate = useNavigate();
  const [fieldOptions, setFieldOptions] = useState([]);
  const [searches, setSearches] = useState([]);
  const [filteredSearches, setFilteredSearches] = useState([]);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);
  const staffId = localStorage.getItem('staffId');
  const schoolId = localStorage.getItem('schoolId');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchtime: '',
    searchdate: '',
    searchname: '',
    searchername: '',
    field: '',
    otherField: '',
    countstudents: '',
    classes: [],
  });

  const [classesByLetter, setClassesByLetter] = useState({});
  const [expandedLetter, setExpandedLetter] = useState(null);

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        setLoading(true);
        if (!schoolId || !staffId) return;

        const confirmRes = await axios.get(
          `${BASE_URL}staff/schoolId/${schoolId}/id/${staffId}`
        );
        const confirm = confirmRes.data[0]?.confirm;

        const response = await axios.get(`${BASE_URL}searches/with/students/saved/${schoolId}`);
        const allSearches = response.data || [];

        let filtered = allSearches;

        if (confirm === 2 || confirm === 3) {
          filtered = allSearches.filter(s => s.searcherid == staffId);
        }

        const sorted = filtered.sort((a, b) => new Date(b.searchdate) - new Date(a.searchdate));
        setSearches(sorted);
        setFilteredSearches(sorted);
      } catch (err) {
        console.error(err);
        setError('שגיאה בטעינת החיפושים');
      }
      finally {
        setLoading(false); // 👈 סיום טעינה בכל מקרה
      }
    };

    fetchSearches();
  }, [schoolId, staffId]);


  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const schoolId = localStorage.getItem("schoolId");
        if (!schoolId) return;
        const response = await axios.get(`${BASE_URL}schools/${schoolId}`);
        const schoolFields = JSON.parse(response.data[0]?.fields || []);

        setFieldOptions(schoolFields);
        const localClasses = localStorage.getItem('classes');
        let classList = [];

        if (localClasses) {
          classList = JSON.parse(localClasses);
        } else {
          const res = await axios.get(`${BASE_URL}students/classes/${schoolId}`);
          const classes = res.data || [];
          localStorage.setItem('classes', JSON.stringify(classes));
          classList = classes;
        }

        const byLetter = {};
        classList.forEach(cls => {
          const match = cls.match(/^([א-ת]{1,2})/);
          const group = match ? match[1] : cls;
          if (!byLetter[group]) byLetter[group] = new Set();
          byLetter[group].add(cls);
        });

        setClassesByLetter(byLetter);
      } catch (err) {
        console.error(err);
        setError('שגיאה בטעינת כיתות');
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    let results = [...searches];

    if (filters.searchname)
      results = results.filter(s => isSimilar(s.searchname, filters.searchname));

    if (filters.searchername)
      results = results.filter(s => isSimilar(s.searchername, filters.searchername));

    if (filters.field && filters.field !== "other") {
      results = results.filter(s => s.field === filters.field);
    } else if (filters.field === "other" && filters.otherField) {
      results = results.filter(s => isSimilar(s.field, filters.otherField));
    }

    if (filters.countstudents)
      results = results.filter(s => Number(s.countstudents) === Number(filters.countstudents));
    if (filters.searchdate || filters.searchtime) {
      results = results.filter(s => {
        if (!s.searchdate) return false;
        const d = new Date(s.searchdate);

        if (filters.searchdate) {
          const dateStr = d.toISOString().slice(0, 10);
          if (dateStr !== filters.searchdate) return false;
        }

        if (filters.searchtime) {
          const hours = d.getHours().toString().padStart(2, '0');
          if (hours !== filters.searchtime.split(':')[0]) return false;
        }

        return true;
      });
    }

    if (filters.classes.length > 0) {
      results = results.filter(search => {
        try {
          const parsedClasses = JSON.parse(search.classes);
          if (!Array.isArray(parsedClasses)) return false;

          const filtersByGroup = {};
          filters.classes.forEach(cls => {
            const match = cls.match(/^([א-ת]{1,2})/);
            const group = match ? match[1] : cls;
            if (!filtersByGroup[group]) filtersByGroup[group] = [];
            filtersByGroup[group].push(cls);
          });

          for (const group in filtersByGroup) {
            const requiredClasses = filtersByGroup[group];
            const allRequiredInSearch = requiredClasses.every(cls => parsedClasses.includes(cls));
            if (!allRequiredInSearch) return false;
          }

          return true;
        } catch (e) {
          return false;
        }
      });
    }

    setFilteredSearches(results);
  }, [filters, searches]);

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

  return (
    <Container className="mt-4">
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '65px' }}>
        <h4 className="mb-4">חיפושים אחרונים</h4>
        <Button
          onClick={() => navigate('../data-fetch')}
          variant="outline-secondary"
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
        >
          חזרה 👉
        </Button>
          <Button
          onClick={() => navigate('../search-by-student')}
          variant="outline-info"
          style={{ position: 'absolute', right: 0, top: '200%', transform: 'translateY(-50%)' }}
        >
          חיפוש לפי תלמידה 👉
        </Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {fieldError && <Alert variant="warning">{fieldError}</Alert>}

      <Form className="mb-4">
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
            {filters.field === "other" && (
              <Form.Control
                type="text"
                placeholder="הקלד תחום"
                className="mt-2"
                value={filters.otherField || ""}
                onChange={(e) => updateFilter('otherField', e.target.value)}
              />
            )}
          </Col>

          <Col md={2}>
            <Form.Label>כיתה</Form.Label>
            <div>
              {Object.keys(classesByLetter).sort().map(letter => (
                <div key={letter} style={{ marginBottom: '5px' }}>
                  <Button
                    variant={filters.classes.some(c => c.startsWith(letter)) ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => selectAllInLetter(letter)}
                  >
                    {letter}
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

          <Col md={1}>
            <Form.Label>כמות</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={filters.countstudents}
              onChange={(e) => updateFilter('countstudents', e.target.value)}
            />
          </Col>

          <Col md={2}>
            <Form.Label>תאריך</Form.Label>
            <Form.Control
              type="date"
              value={filters.searchdate}
              onChange={(e) => updateFilter('searchdate', e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Label>שעה</Form.Label>
            <Form.Control
              type="time"
              value={filters.searchtime}
              onChange={(e) => updateFilter('searchtime', e.target.value)}
            />
          </Col>

        </Row>
      </Form>

      {loading ? (
        <p>טוען חיפושים...</p>
      ) : filteredSearches.length === 0 ? (
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
              <th>בחירה ידנית</th>
            </tr>
          </thead>
          <tbody>
            {filteredSearches.map(search => (
              <tr key={search.id} onClick={() => navigate(`/search-result-not-to-edit/${search.id}`)}
                style={{ cursor: 'pointer' }}>
                <td>{search.searchname}</td>
                <td>{search.searchername}</td>
                <td>{search.field}</td>
                <td>
                  {(() => {
                    try {
                      console.log("search.classes:", search.classes);
                      
                      const parsed = JSON.parse(search.classes);
                      if (!Array.isArray(parsed)) return '';

                      const allClasses = JSON.parse(localStorage.getItem('classes') || '[]');
                      const classesByGroup = {};

                      allClasses.forEach(cls => {
                        const match = cls.match(/^([א-ת]{1,2})/);
                        const group = match ? match[1] : cls;
                        if (!classesByGroup[group]) classesByGroup[group] = [];
                        classesByGroup[group].push(cls);
                      });

                      const resultGroups = [];
                      const remainingClasses = [];

                      Object.entries(classesByGroup).forEach(([group, classList]) => {
                        const allInSearch = classList.every(cls => parsed.includes(cls));
                        if (allInSearch) {
                          resultGroups.push(group);
                        } else {
                          const partial = classList.filter(cls => parsed.includes(cls));
                          remainingClasses.push(...partial);
                        }
                      });

                      return [...resultGroups, ...remainingClasses].join(', ');
                    } catch (e) {
                      return '';
                    }
                  })()}
                </td>
                <td>{search.countstudents}</td>
                <td>{new Date(search.searchdate).toLocaleString('he-IL')}</td>
                 <td>{search.classes == [] ? "V":"x"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default RecentSearchesPage;
