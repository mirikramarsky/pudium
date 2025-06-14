import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Table, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';

const SearchDetailsPage = () => {
  const { id } = useParams();
  const [search, setSearch] = useState(null);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchAndStudents = async () => {
      try {
        const searchRes = await axios.get(`https://pudium-production.up.railway.app/api/podium/searches/${id}`);
        // const studentsRes = await axios.get(`https://pudium-production.up.railway.app/api/podium/searchstudents/${id}`);

        setSearch(searchRes.data);
        // setStudents(studentsRes.data);
        setLoading(false);
      } catch (err) {
        setError('שגיאה בטעינת החיפוש או התלמידות');
        setLoading(false);
      }
    };

    fetchSearchAndStudents();
  }, [id]);

  if (loading) return <Spinner animation="border" className="m-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!search) return <p>החיפוש לא נמצא</p>;

  return (
    <Container className="mt-4">
      <h4>פרטי חיפוש: {search.searchname}</h4>

      <Card className="mb-4 p-3">
        <Row>
          <Col md={4}><strong>שם מחפשת:</strong> {search.searchername}</Col>
          <Col md={4}><strong>תחום:</strong> {search.field}</Col>
          <Col md={4}><strong>כיתה:</strong> {search.mingrade} - {search.maxgrade}</Col>
          <Col md={4}><strong>כמות תלמידות:</strong> {search.countstudents}</Col>
          <Col md={8}><strong>תאריך:</strong> {new Date(search.createdAt).toLocaleString('he-IL')}</Col>
        </Row>
      </Card>

      <h5>תלמידות:</h5>

      {students.length === 0 ? (
        <p>לא נמצאו תלמידות בחיפוש זה</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>שם פרטי</th>
              <th>שם משפחה</th>
              <th>כיתה</th>
              <th>תחום 1</th>
              <th>תחום 2</th>
              <th>תחום 3</th>
              <th>עדיפות כללית</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.grade}</td>
                <td>{student.field1}</td>
                <td>{student.field2}</td>
                <td>{student.field3}</td>
                <td>{student.severalPriority}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default SearchDetailsPage;
