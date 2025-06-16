import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Table, Alert, Spinner, Row, Col, Card, Button } from 'react-bootstrap';

const getPriorityColor = (priority) => {
    switch (priority) {
        case 0: return '#d3d3d3'; // אפור
        case 1: return 'white';   // לבן
        case 2: return '#e0f7fa'; // תכלת
        case 3: return '#b2ebf2'; // תכלת כהה
        case 4: return '#81d4fa'; // כחול בהיר
        case 5: return '#4fc3f7'; // כחול
        case 6: return '#0288d1'; // כחול כהה
        case 7: return '#9575cd'; // סגול
        case 8: return '#e57373'; // אדום
        default: return 'white';
    }
};

const SearchDetailsPage = () => {
    const { id } = useParams();
    const [search, setSearch] = useState(null);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [mailSent, setMailSent] = useState(false);

    useEffect(() => {
        const fetchSearchAndStudents = async () => {
            try {
                const schoolid = localStorage.getItem('schoolId');
                if (!schoolid) {
                    setError('קוד מוסד לא נמצא. אנא התחבר מחדש.');
                    setLoading(false);
                    return;
                }

                const searchRes = await axios.get(`https://pudium-production.up.railway.app/api/podium/searches/${id}`);
                setSearch(searchRes.data[0]);

                const studentsRes = await axios.get(`https://pudium-production.up.railway.app/api/podium/stuInSea/search/${id}`);

                const detailedStudentsPromises = studentsRes.data.map(student =>
                    axios
                        .post(`https://pudium-production.up.railway.app/api/podium/students/schoolid/${student.studentid}`, {
                            schoolId: schoolid
                        })
                        .then(res => {
                            const data = res.data;
                            const fullData = Array.isArray(data) ? data : [data];
                            return fullData.map(s => ({ ...s, searchstudentid: student.id }));
                        })
                );

                const detailedStudentsNested = await Promise.all(detailedStudentsPromises);
                const detailedStudents = detailedStudentsNested.flat();
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

    const handleDeleteStudentFromSearch = async (studentSearchId) => {
        try {
            await axios.delete(`https://pudium-production.up.railway.app/api/podium/stuInSea/${studentSearchId}`);
            setStudents(prev => prev.filter(s => s.searchstudentid !== studentSearchId));
        } catch (err) {
            console.error('שגיאה במחיקה:', err);
            alert('שגיאה במחיקת תלמידה מהחיפוש');
        }
    };

    const handleSendApprovalEmail = async () => {
        try {
            const schoolId = localStorage.getItem('schoolId');
            const emailRes = await axios.get(`https://pudium-production.up.railway.app/api/podium/schools/${schoolId}`);
            const recipientEmail = emailRes.data.email;

            const emailContent = {
                to: recipientEmail,
                subject: `אישור חיפוש - ${search.searchname}`,
                searchId: id,
                searchDetails: search,
                students: students,
                approveUrl: `https://pudium-production.up.railway.app/api/podium/approve/${id}`,
                deleteUrl: `https://pudium-production.up.railway.app/api/podium/searches/${id}`,
                editUrl: `http://localhost:5173/search-results/${id}` // שנה לפי ה-URL שלך בפרודקשן
            };

            await axios.post(`https://pudium-production.up.railway.app/api/podium/send-approval-email`, emailContent);
            setMailSent(true);
        } catch (err) {
            console.error('שגיאה בשליחת המייל:', err);
            alert('שגיאה בשליחת המייל');
        }
    };

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
                    <Col md={4}>
                        <strong>כיתות:</strong>{' '}
                        {search.classes ? JSON.parse(search.classes).join(', ') : '–'}
                    </Col>
                    <Col md={4}><strong>כמות תלמידות:</strong> {search.countstudents}</Col>
                    <Col md={8}><strong>תאריך:</strong> {new Date(search.searchdate).toLocaleString('he-IL')}</Col>
                </Row>
            </Card>

            <h5>תלמידות:</h5>

            {students.length === 0 ? (
                <p>לא נמצאו תלמידות בחיפוש זה</p>
            ) : (
                <>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>מחק</th>
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
                                <tr key={student.id} style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteStudentFromSearch(student.searchstudentid)}
                                        >
                                            מחק
                                        </Button>
                                    </td>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.severalpriority}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.field4priority) }}>{student.field4}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.field3priority) }}>{student.field3}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.field2priority) }}>{student.field2}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.field1priority) }}>{student.field1}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.class} {student.grade}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.lastname}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.firstname}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="text-end">
                        <Button
                            variant="success"
                            onClick={handleSendApprovalEmail}
                            disabled={mailSent}
                        >
                            {mailSent ? 'המייל נשלח' : 'שלח מייל לאישור ושמירת החיפוש'}
                        </Button>
                    </div>
                </>
            )}
        </Container>
    );
};

export default SearchDetailsPage;
