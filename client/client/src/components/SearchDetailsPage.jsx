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
                const schoolid = localStorage.getItem('schoolId');
                if (!schoolid) {
                    setError('קוד מוסד לא נמצא. אנא התחבר מחדש.');
                    setLoading(false);
                    return;
                }

                // שליפת פרטי החיפוש
                const searchRes = await axios.get(`https://pudium-production.up.railway.app/api/podium/searches/${id}`);
                setSearch(searchRes.data[0]);

                // שליפת מזהי התלמידות
                const studentsRes = await axios.get(`https://pudium-production.up.railway.app/api/podium/stuInSea/search/${id}`);

                // קריאה לכל תלמידה לפי ה-ID שלה והוספת schoolId
                const detailedStudentsPromises = studentsRes.data.map(student =>
                    axios
                        .post(`https://pudium-production.up.railway.app/api/podium/students/schoolid/${student.studentid}`, {
                            schoolId: schoolid
                        })
                        .then(res => {
                            const data = res.data;
                            // אם חוזר מערך – נחזיר אותו, אם זה אובייקט בודד – נהפוך אותו למערך
                            return Array.isArray(data) ? data : [data];
                        })
                );

                // מחכים שכולן יסתיימו
                const detailedStudentsNested = await Promise.all(detailedStudentsPromises);

                // שיטוח מערכים לתוך רשימה אחת
                const detailedStudents = detailedStudentsNested.flat();

                // שמירת התלמידות לסטייט
                setStudents(detailedStudents);
                setLoading(false);
            } catch (err) {
                console.error('שגיאה בטעינה:', err);
                setError('שגיאה בטעינת החיפוש או התלמידות');
                setLoading(false);
            }
        };


        fetchSearchAndStudents();
    }, [id]);
    console.log(students);
    if (loading) return <Spinner animation="border" className="m-4" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!search) return <p>החיפוש לא נמצא</p>;
console.log(JSON.parse(search.classes));

    return (
        <Container className="mt-4">
            <h4>פרטי חיפוש: {search.searchname}</h4>

            <Card className="mb-4 p-3">
                <Row>
                    <Col md={4}><strong>שם מחפשת:</strong> {search.searchername}</Col>
                    <Col md={4}><strong>תחום:</strong> {search.field}</Col>
                    <Col md={4}>
                        <strong>כיתות:</strong>{' '}
                        {search.classes
                            ? JSON.parse(search.classes).join(', ')
                        : '–'}
                    </Col>
                    <Col md={4}><strong>כמות תלמידות:</strong> {search.countstudents}</Col>
                    <Col md={8}><strong>תאריך:</strong> {new Date(search.searchdate).toLocaleString('he-IL')}</Col>
                </Row>
            </Card>

            <h5>תלמידות:</h5>

            {students.length === 0 ? (
                <p>לא נמצאו תלמידות בחיפוש זה</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>עדיפות כללית</th>
                            <th>תחום 4</th>
                            <th>תחום 3</th>
                            <th>תחום 2</th>
                            <th>תחום 1</th>
                            <th>כיתה</th>
                            <th>שם משפחה</th>
                            <th>שם פרטי</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id}>
                                <td>{student.severalpriority}</td>
                                <td>{student.field4}</td>
                                <td>{student.field3}</td>
                                <td>{student.field2}</td>
                                <td>{student.field1}</td>
                                <td>{student.class} {student.grade}</td>
                                <td>{student.lastname}</td>
                                <td>{student.firstname}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default SearchDetailsPage;
