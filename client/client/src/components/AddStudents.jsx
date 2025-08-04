import React, { useState } from 'react';
import { Container, Alert, Form, Button, Table, Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import axios from 'axios';
import BASE_URL from '../config';

const UploadStudentsExcel = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [uploadMessage, setUploadMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const downloadTemplate = () => {
        const worksheet = XLSX.utils.aoa_to_sheet([
            ['123456789', 'שם פרטי', 'שם משפחה', '1', 'א'] // שורה לדוגמה, לא חובה
        ]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'StudentsTemplate');
        XLSX.writeFile(workbook, 'students_template.xlsx');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const raw = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            const rows = raw.filter((row) => row.length >= 5); // לוודא שיש 5 עמודות לפחות

            const schoolId = localStorage.getItem('schoolId');
            if (!schoolId) {
                setError('קוד מוסד לא נמצא. אנא התחברי מחדש.');
                return;
            }

            const parsedStudents = rows.map((row) => ({
                id: row[0]?.toString().trim(),
                firstname: row[1]?.toString().trim(),
                lastname: row[2]?.toString().trim(),
                grade: row[3]?.toString().trim(),
                class: row[4]?.toString().trim(),
                schoolid: schoolId,
            }));

            setStudents(parsedStudents);
            setUploadMessage(null);
            setError(null);
        };
        reader.readAsBinaryString(file);
    };

    const handleUpload = async () => {
        console.log('Uploading students:', students);
        
        if (students.length === 0) {
            setError('לא הועלו נתונים.');
            return;
        }

        setLoading(true);
        let success = 0;
        let failed = 0;

        // for (const student of students) {
            try {
                const res = await axios.post(`${BASE_URL}students/`,{students:students});
                if (res.status === 200) success++;
                else failed++;
            } catch (err) {
                failed++;
                console.error('שגיאה:', err.response?.data || err.message);
            }
        // }

        setUploadMessage(`תלמידות שהועלו בהצלחה: ${success} | שגיאות: ${failed}`);
        setLoading(false);
    };

    return (
        <Container className="mt-4">
            <h3 className="mb-4">העלאת תלמידות מקובץ Excel</h3>

            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>בחרי קובץ Excel (ללא שורת כותרת)</Form.Label>
                <div className="d-flex gap-3 align-items-center">
                    <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    <Button variant="secondary" onClick={downloadTemplate}>
                        הורדת תבנית Excel
                    </Button>
                </div>
            </Form.Group>


            {error && <Alert variant="danger">{error}</Alert>}
            {uploadMessage && <Alert variant="success">{uploadMessage}</Alert>}

            {students.length > 0 && (
                <>
                    <Table striped bordered hover responsive size="sm" className="mt-4">
                        <thead>
                            <tr>
                                <th>ת"ז</th>
                                <th>שם פרטי</th>
                                <th>שם משפחה</th>
                                <th>כיתה</th>
                                <th>שכבה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, idx) => (
                                <tr key={idx}>
                                    <td>{student.id}</td>
                                    <td>{student.firstname}</td>
                                    <td>{student.lastname}</td>
                                    <td>{student.class}</td>
                                    <td>{student.grade}</td>
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

export default UploadStudentsExcel;
