import React, { useEffect, useState } from 'react';
import { Container, Form, Row, Col, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecentSearchesPage = () => {
  const navigate = useNavigate();
  const [fieldOptions, setFieldOptions] = useState([]);
  const [searches, setSearches] = useState([]);
  const [filteredSearches, setFilteredSearches] = useState([]);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);
  const staffId = localStorage.getItem('staffId');
  const schoolId = localStorage.getItem('schoolId');

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
        if (!schoolId || !staffId) return;

        const confirmRes = await axios.get(
          `https://pudium-production.up.railway.app/api/podium/staff/schoolId/${schoolId}/id/${staffId}`
        );
        const confirm = confirmRes.data[0]?.confirm;

        const response = await axios.get(`https://pudium-production.up.railway.app/api/podium/searches/with/students/saved/`);
        const allSearches = response.data || [];

        let filtered = allSearches;

        // סינון לפי confirm
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
    };

    fetchSearches();
  }, [schoolId, staffId]);


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

        // השוואת תאריך אם סופק
        if (filters.searchdate) {
          const dateStr = d.toISOString().slice(0, 10);
          if (dateStr !== filters.searchdate) return false;
        }

        // השוואת שעה אם סופקה
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

          // יוצרים מיפוי לפי אות
          const filtersByLetter = {};
          filters.classes.forEach(cls => {
            const letter = cls[0];
            if (!filtersByLetter[letter]) filtersByLetter[letter] = [];
            filtersByLetter[letter].push(cls);
          });

          // עבור כל אות - נבדוק האם כל הכיתות שלה מופיעות ב-search
          for (const letter in filtersByLetter) {
            const requiredClasses = filtersByLetter[letter];
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
      <h4 className="mb-4">חיפושים אחרונים</h4>

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
                      const parsed = JSON.parse(search.classes);
                      if (!Array.isArray(parsed)) return '';

                      const allClasses = JSON.parse(localStorage.getItem('classes') || '[]');
                      const classesByLetter = {};

                      // מחלקים את כל הכיתות לפי אות
                      allClasses.forEach(cls => {
                        const letter = cls[0];
                        if (!classesByLetter[letter]) classesByLetter[letter] = [];
                        classesByLetter[letter].push(cls);
                      });

                      const resultLetters = [];
                      const remainingClasses = [];

                      Object.entries(classesByLetter).forEach(([letter, classList]) => {
                        const allInSearch = classList.every(cls => parsed.includes(cls));
                        if (allInSearch) {
                          resultLetters.push(letter);
                        } else {
                          const partial = classList.filter(cls => parsed.includes(cls));
                          remainingClasses.push(...partial);
                        }
                      });

                      return [...resultLetters, ...remainingClasses].join(', ');
                    } catch (e) {
                      return '';
                    }
                  })()}
                </td>

                <td>{search.countstudents}</td>
                <td>{new Date(search.searchdate).toLocaleString('he-IL')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default RecentSearchesPage;
