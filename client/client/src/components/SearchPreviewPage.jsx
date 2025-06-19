import React, { useEffect, useState } from 'react';
import { Button, Container, Table, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchPreviewPage = () => {
  const { searchId } = useParams();
  const [students, setStudents] = useState([]);
  const [searchInfo, setSearchInfo] = useState({});
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://pudium-production.up.railway.app/api/podium/searches/${searchId}`)
      .then(res => {
        setSearchInfo(res.data.search);
        setStudents(res.data.students);
      })
      .catch(() => setError('שגיאה בטעינת החיפוש'));
  }, [searchId]);

  const removeStudent = (id) => {
    const newList = students.filter(s => s.id !== id);
    setStudents(newList);
    // כאן אפשר גם לשלוח בקשת DELETE לשרת, אם רוצים שהשינוי יהיה קבוע
  };

  const sendForApproval = async () => {
    setSending(true);
    try {
      await axios.post(`https://pudium-production.up.railway.app/api/podium/send-approval`, {
        searchId,
        to: 'approval@example.com' // ניתן לשים גם לפי שם הצוות
      });
      alert('המייל נשלח לאישור');
    } catch {
      setError('שליחת המייל נכשלה');
    } finally {
      setSending(false);
    }
  };

  return (
    <Container className="mt-4">
      <h4>תצוגת תלמידות לחיפוש: {searchInfo.searchname}</h4>
      <p>מחפשת: {searchInfo.searchername}</p>
      <p>תחום: {searchInfo.field}</p>
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>שם פרטי</th>
            <th>שם משפחה</th>
            <th>כיתה</th>
            <th>עדיפות</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.firstName}</td>
              <td>{s.lastName}</td>
              <td>{s.grade}</td>
              <td>{s.severalPriority}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => removeStudent(s.id)}>הסר</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="success" onClick={sendForApproval} disabled={sending}>
        שלח לאישור במייל
      </Button>
    </Container>
  );
};

export default SearchPreviewPage;
