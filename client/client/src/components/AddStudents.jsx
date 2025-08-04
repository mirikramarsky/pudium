import React, { useState } from 'react';
import { Container, Alert, Form, Button, Table, Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import axios from 'axios';
import BASE_URL from '../config';

const AddStudents = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setStudents(data);
      setUploadMessage(null);
      setError(null);
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (students.length === 0) {
      setError('לא הועלה קובץ או שהקובץ ריק');
      return;
    }

    setLoading(true);
    let success = 0;
    let failed = 0;

    for (const student of students) {
      try {
        const res = await axios.post(`${BASE_URL}students/`, student);
        if (res.status === 200) success++;
        else failed++;
      } catch (err) {
        failed++;
        console.error('שגיאה:', err.response?.data || err.message);
      }
    }

    setUploadMessage(`תלמידות שהועלו בהצלחה: ${success} | שגיאות: ${failed}`);
    setLoading(false);
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">העלאת קובץ Excel של תלמידות</h3>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>בחרי קובץ Excel (סיומת .xlsx / .xls)</Form.Label>
        <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}
      {uploadMessage && <Alert variant="success">{uploadMessage}</Alert>}

      {students.length > 0 && (
        <>
          <Table striped bordered hover responsive size="sm" className="mt-4">
            <thead>
              <tr>
                {Object.keys(students[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={idx}>
                  {Object.values(student).map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="mt-3 d-flex justify-content-end">
            <Button onClick={handleUpload} disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  מעלה...
                </>
              ) : (
                'העלה תלמידות'
              )}
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default AddStudents;
