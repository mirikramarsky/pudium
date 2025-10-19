import React, { useRef, useState } from 'react';
import { Container, Alert, Form, Button, Table, Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import axios from 'axios';
import BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';

const AddStudents = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [uploadMessage, setUploadMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skippedStudents, setSkippedStudents] = useState([]);
    const messageRef = useRef(null);

    const navigate = useNavigate();
    const scrollToMessage = () => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const downloadTemplate = () => {
        const worksheet = XLSX.utils.aoa_to_sheet([
            ['שם פרטי', 'שם משפחה', '123456789', '1א'] // שורה לדוגמה, לא חובה
        ]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'StudentsTemplate');
        XLSX.writeFile(workbook, 'students_template.xlsx');
    };

   const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        const filename = file.name.toLowerCase();
        const isCSV = filename.endsWith(".csv") || filename.endsWith(".csv.xls");

        reader.onload = (event) => {
            let rows;

            if (isCSV) {
                const text = new TextDecoder("utf-8").decode(event.target.result);
                rows = text.split(/\r?\n/).map(r => r.split(/\t|,/)); // תמיכה ב-tab ו-comma
            } else {
                const workbook = XLSX.read(event.target.result, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            }

            // סינון שורות ריקות או הערות
            rows = rows.filter(r => r.some(cell => cell && cell.toString().trim() !== ""));

            // רשימה של אפשרויות כותרות ידועות בעברית ובאנגלית
            const knownHeaders = [
                ["last name kinuy", "first name kinuy", "ת.ז.", "כיתה"],
                ["שם משפחה", "שם פרטי", "ת.ז.", "כיתה"]
            ];

            // מציאת השורה הראשונה שמכילה לפחות 2 כותרות ידועות
            let headerRowIndex = -1;
            for (let i = 0; i < rows.length; i++) {
                const rowLower = rows[i].map(cell => cell?.toString().toLowerCase());
                if (knownHeaders.some(headers =>
                    headers.filter(h => rowLower.includes(h.toLowerCase())).length >= 2
                )) {
                    headerRowIndex = i;
                    break;
                }
            }

            if (headerRowIndex === -1) {
                setError("לא נמצאה שורת כותרות מתאימה בקובץ.");
                return;
            }

            // כל השורות אחרי הכותרות
            const dataRows = rows.slice(headerRowIndex + 1);

            const schoolId = localStorage.getItem("schoolId");
            if (!schoolId) {
                setError("קוד מוסד לא נמצא. אנא התחברי מחדש.");
                return;
            }

            // מיפוי השורות לאובייקט תלמיד
            const parsedStudents = dataRows.map(row => {
                const fullClass = row[3]?.toString().trim() || "";
                return {
                    id: row[2]?.toString().trim() || "",
                    firstname: row[1]?.toString().trim() || "",
                    lastname: row[0]?.toString().trim() || "",
                    class: fullClass ? fullClass[0] : "",
                    grade: fullClass ? fullClass.slice(1) : "",
                    schoolid: schoolId,
                };
            }).filter(s => s.id && s.firstname && s.lastname); // מסננים שורות ריקות

            setStudents(parsedStudents);
            setUploadMessage(null);
            setError(null);
        };

        if (isCSV) {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsBinaryString(file);
        }
    };


    const handleUpload = async () => {
        if (students.length === 0) {
            setError('לא הועלו נתונים.');
            scrollToMessage();
            return;
        }

        setLoading(true);
        setError(null);
        setUploadMessage(null);
        setSkippedStudents([]);

        try {
            console.log("Uploading students:", students);
            
            const res = await axios.post(`${BASE_URL}students/`, { students });
            const { added, skipped } = res.data;

            if (added.length > 0) {
                setUploadMessage(`הועלו ${added.length} תלמידות בהצלחה.`);
                scrollToMessage();
            }

            if (skipped.length > 0) {
                setSkippedStudents(skipped);
                scrollToMessage();
            }
        } catch (err) {
            console.error('שגיאה:', err.response?.data || err.message);
            setError('אירעה שגיאה בלתי צפויה בהעלאת הקובץ.');
        }

        setLoading(false);
    };


    return (
        <Container className="mt-4">
            <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
                <h3 className="mb-4">העלאת תלמידות מקובץ Excel</h3>
                <Button
                    onClick={() => navigate('../staff-manage')}
                    variant="outline-secondary"
                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                >
                    חזרה 👉
                </Button>
            </div>

            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>בחרי קובץ Excel </Form.Label>
                <div className="d-flex gap-3 align-items-center">
                    <Form.Control
                        type="file"
                        accept=".xlsx, .xls, .csv, .csv.xls"
                        onChange={handleFileUpload}
                    />

                    <Button variant="secondary" onClick={downloadTemplate}>
                        הורדת תבנית Excel
                    </Button>
                </div>
            </Form.Group>

            <div ref={messageRef}>
                {error && <Alert variant="danger">{error}</Alert>}
                {uploadMessage && <Alert variant="success">{uploadMessage}</Alert>}
                {skippedStudents.length > 0 && (
                    <>
                        <Alert variant="warning">
                            לא הועלו {skippedStudents.length} תלמידות:
                        </Alert>
                        <Table striped bordered hover responsive size="sm">
                            <thead>
                                <tr>
                                    <th>ת"ז</th>
                                    <th>סיבה</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skippedStudents.map((student, idx) => (
                                    <tr key={idx}>
                                        <td>{student.id}</td>
                                        <td>{student.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                )}
            </div>
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

export default AddStudents;
