import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Table, Button, Alert } from 'react-bootstrap';

const SearchResultsPage = () => {
  const { searchId } = useParams();
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`https://pudium-production.up.railway.app/api/podium/stuInSea/search/${searchId}`);
        const data = await response.json();

        if (data.length === 0) {
          setError('לא נמצאו תלמידות להצגה.');
        } else {
          setStudents(filtered);
        }
      } catch (err) {
        setError('שגיאה בעת שליפת התלמידות מהשרת.');
        console.error(err);
      }
    };

    fetchStudents();
  }, [searchId]);


  const handleRemove = (studentId) => {
    const updated = students.filter(s => s.id !== studentId);
    setStudents(updated);

    // כאן בעתיד תשלחי בקשה חדשה לשרת כדי לקבל את הבאה בתור
    // בינתיים רק מעדכנים את הרשימה המקומית
  };

  return (
    <Container className="mt-4">
      <h4>תוצאות חיפוש</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {!error && students.length === 0 && <p>אין תלמידות להצגה.</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>שם פרטי</th>
            <th>שם משפחה</th>
            <th>כיתה</th>
            <th>מחיקה</th>
          </tr>
        </thead>
        <tbody>
          {students.map(st => (
            <tr key={st.id}>
              <td>{st.firstName}</td>
              <td>{st.lastName}</td>
              <td>{st.grade}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleRemove(st.id)}>X</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default SearchResultsPage;
