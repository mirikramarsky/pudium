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

    // const handleFileUpload = (e) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;

    //     const reader = new FileReader();
    //     reader.onload = (event) => {
    //         const binaryStr = event.target.result;
    //         const workbook = XLSX.read(binaryStr, { type: 'binary' });
    //         const sheetName = workbook.SheetNames[0];
    //         const raw = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    //         const rows = raw.filter((row) => row.length >= 5); // לוודא שיש 5 עמודות לפחות

    //         const schoolId = localStorage.getItem('schoolId');
    //         if (!schoolId) {
    //             setError('קוד מוסד לא נמצא. אנא התחברי מחדש.');
    //             scrollToMessage();
    //             return;
    //         }

    //         const parsedStudents = rows.map((row) => ({
    //             id: row[0]?.toString().trim(),
    //             firstname: row[1]?.toString().trim(),
    //             lastname: row[2]?.toString().trim(),
    //             grade: row[3]?.toString().trim(),
    //             class: row[4]?.toString().trim(),
    //             schoolid: schoolId,
    //         }));

    //         setStudents(parsedStudents);
    //         setUploadMessage(null);
    //         setError(null);
    //     };
    //     reader.readAsBinaryString(file);
    // };
    // const handleFileUpload = (e) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;

    //     const reader = new FileReader();
    //     const isCSV = file.name.includes(".csv");

    //     console.log(isCSV);

    //     reader.onload = (event) => {
    //         const data = event.target.result;

    //         let rows;
    //         if (isCSV) {
    //             // CSV
    //             console.log("I am CSV");
    //             const text = new TextDecoder("utf-8").decode(data);
    //             rows = text.split("\n").map(r => r.split(","));
    //         } else {
    //             // XLS/XLSX
    //             console.log("I am XLSX");
    //             const workbook = XLSX.read(data, { type: "binary" });
    //             const sheetName = workbook.SheetNames[0];
    //             rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    //         }

    //         // לדלג על כותרות
    //         rows = rows.slice(1).filter((row) => row.length >= 4);

    //         const schoolId = localStorage.getItem("schoolId");
    //         if (!schoolId) {
    //             setError("קוד מוסד לא נמצא. אנא התחברי מחדש.");
    //             return;
    //         }

    //         const parsedStudents = rows.map((row) => {
    //             const fullClass = row[3]?.toString().trim();
    //             const grade = fullClass ? fullClass[0] : "";
    //             const classNum = fullClass ? fullClass.slice(1) : "";
    //             return {
    //                 id: row[2]?.toString().trim(),
    //                 firstname: row[1]?.toString().trim(),
    //                 lastname: row[0]?.toString().trim(),
    //                 grade,
    //                 class: classNum,
    //                 schoolid: schoolId,
    //             };
    //         });

    //         setStudents(parsedStudents);
    //         setUploadMessage(null);
    //         setError(null);
    //     };

    //     if (isCSV) {
    //         reader.readAsArrayBuffer(file);
    //     } else {
    //         reader.readAsBinaryString(file);
    //     }
    // };
    const handleFileUpload = (e) => {
        alert("I am in handleFileUpload");
        const file = e.target.files?.[0];
        alert("file: " + file);
        if (!file) return;

        const reader = new FileReader();
        const filename = file.name.toLowerCase();
        const isCSV = filename.endsWith(".csv") || filename.endsWith(".csv.xls");
        alert("isCSV: " + isCSV);
        reader.onload = (event) => {
            let rows;

            if (isCSV) {
                // CSV
                const text = new TextDecoder("utf-8").decode(event.target.result);
                rows = text.split("\n").map(r => r.split(/\t|,/)); // תמיכה גם ב־tab וגם ב־comma
            } else {
                // XLS/XLSX
                const workbook = XLSX.read(event.target.result, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            }
            const htmlString = rows[0]; // כל התוכן שקיבלת
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, "text/html");
            const table = doc.querySelector("table");
            const data = Array.from(table.rows).map(row => Array.from(row.cells).map(cell => cell.textContent.trim()));
            console.log(data);
            rows = data;
            alert("rows: " + rows);
            // לדלג על שורת הכותרות
            rows = rows.slice(1).filter((row) => row.length >= 4);

            const schoolId = localStorage.getItem("schoolId");
            if (!schoolId) {
                setError("קוד מוסד לא נמצא. אנא התחברי מחדש.");
                return;
            }

            const parsedStudents = rows.map((row) => {
                const fullClass = row[3]?.toString().trim();
                const grade = fullClass ? fullClass[0] : "";
                const classNum = fullClass ? fullClass.slice(1) : "";
                return {
                    id: row[2]?.toString().trim(),
                    firstname: row[1]?.toString().trim(),
                    lastname: row[0]?.toString().trim(),
                    grade,
                    class: classNum,
                    schoolid: schoolId,
                };
            });

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
