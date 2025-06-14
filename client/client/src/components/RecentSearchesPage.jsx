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
    mingrade: '',
    countstudents: ''
  });

  useEffect(() => {
    axios.get('https://pudium-production.up.railway.app/api/podium/searches/')
      .then(res => {
        const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

    if (filters.mingrade)
      results = results.filter(s => Number(s.mingrade) === Number(filters.mingrade));

    if (filters.countstudents)
      results = results.filter(s => Number(s.countstudents) === Number(filters.countstudents));

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
            <Form.Label>כיתה</Form.Label>
            <Form.Select
              value={filters.mingrade}
              onChange={(e) => updateFilter('mingrade', e.target.value)}
            >
              <option value="">בחר כיתה</option>
              {[9, 10, 11, 12].map(g => (
                <option key={g} value={g}>כיתה {g}</option>
              ))}
            </Form.Select>
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
              <th>כיתה</th>
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
                <td>{search.mingrade} - {search.maxgrade}</td>
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
