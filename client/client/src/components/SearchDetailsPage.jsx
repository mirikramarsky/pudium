import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Table, Alert, Spinner, Row, Col, Card, Button } from 'react-bootstrap';
import BASE_URL from '../config';

const getPriorityColor = (priority) => {
    switch (priority) {
        case 0: return '#e0e0e0';
        case 1: return '#ffffff';
        case 2: return '#e0f7fa';
        case 3: return '#b2ebf2';
        case 4: return '#80deea';
        case 5: return '#a5d6a7';
        case 6: return '#66bb6a';
        case 7: return '#388e3c';
        case 8: return '#ffd700';
        default: return 'white';
    }
};

const SearchDetailsPage = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [search, setSearch] = useState(null);
    const [students, setStudents] = useState([]);
    const [shownStudentIds, setShownStudentIds] = useState([]);
    const [allShownStudents, setAllShownStudents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [mailSent, setMailSent] = useState(false);
    const urlParams = new URLSearchParams(window.location.search);
    const schoolIdFromUrl = urlParams.get('schoolId');

    if (schoolIdFromUrl) {
        localStorage.setItem('schoolId', schoolIdFromUrl);
    }
    useEffect(() => {
        const fetchSearchAndStudents = async () => {
            let searchData = null;
            try {
                const schoolId = localStorage.getItem('schoolId');
                if (!schoolId) {
                    setError('קוד מוסד לא נמצא. אנא התחבר מחדש.');
                    setLoading(false);
                    return;
                }

                const resSearch = await axios.get(`${BASE_URL}searches/${id}`);
                searchData = resSearch.data?.[0];

                if (!searchData) {
                    setError('החיפוש לא קיים');
                    setSearch(null);
                    setLoading(false);
                    return;
                }

                setSearch(searchData);

                const allShownKey = `shown_${id}`;
                const activeKey = `active_${id}`;
                let savedAllShown = JSON.parse(localStorage.getItem(allShownKey) || '[]');
                let savedActive = JSON.parse(localStorage.getItem(activeKey) || '[]');

                // שלב 1 - אם יש ב-localStorage
                if (savedAllShown.length > 0 && savedActive.length > 0) {
                    console.log(typeof (JSON.stringify(savedActive)));
                    console.log(savedActive)
                    const resStudents = await axios.post(
                        `${BASE_URL}students/students/${schoolId}`,
                        { studentIds: JSON.stringify(savedActive) }
                    );
                    const resAllStudents = await axios.post(
                        `${BASE_URL}students/students/${schoolId}`,
                        { studentIds: JSON.stringify(savedAllShown) }
                    );

                    setStudents(resStudents.data);
                    setAllShownStudents(resAllStudents.data);
                    setShownStudentIds(savedAllShown);
                    setLoading(false);
                    return;
                }

                // שלב 2 - נסיון להביא קודים מהשרת
                try {
                    const resIds = await axios.get(`${BASE_URL}stuInSea/search/${id}`);
                    const fetchedIds = resIds.data.map(s => s.id);

                    if (fetchedIds.length > 0) {
                        console.log(JSON.stringify(fetchedIds));

                        const resStudents = await axios.post(
                            `${BASE_URL}students/students/${schoolId}`,
                            { studentIds: JSON.stringify(fetchedIds) }
                        );
                        setStudents(resStudents.data);
                        setAllShownStudents(resStudents.data);
                        setShownStudentIds(fetchedIds);
                        localStorage.setItem(allShownKey, JSON.stringify(fetchedIds));
                        localStorage.setItem(activeKey, JSON.stringify(fetchedIds));
                        setLoading(false);
                        return;
                    }
                } catch (err) {
                    if (err.response && err.response.status === 400) {
                        console.log('לא נמצאו תלמידות בחיפוש השמור - עובר לשלב 3');
                    } else {
                        console.error('שגיאה בשליפה מהחיפוש השמור:', err);
                        setError('שגיאה בשליפת נתוני חיפוש שמורים');
                        setLoading(false);
                        return;
                    }
                }


                // שלב 3 - אין בשרת כלום - מבצעים חיפוש רגיל
                const searchParams = {
                    myField: searchData.field,
                    schoolId: Number(schoolId) || 0,
                    count: searchData.countstudents,
                    classes: searchData.classes ? JSON.parse(searchData.classes) : [],
                    excludeIds: []
                };

                try {
                    const resStudents = await axios.post(
                        `${BASE_URL}students/params/`,
                        searchParams
                    );

                    const foundStudents = resStudents.data;
                    const newIds = foundStudents.map(s => s.id);
                    setStudents(foundStudents);
                    setAllShownStudents(foundStudents);
                    setShownStudentIds(newIds);
                    localStorage.setItem(allShownKey, JSON.stringify(newIds));
                    localStorage.setItem(activeKey, JSON.stringify(newIds));

                } catch (err) {
                    if (err.response && err.response.status === 400) {
                        setError('לא נמצאו תלמידות תואמות לחיפוש הזה');
                        setStudents([]);
                        setAllShownStudents([]);
                        setShownStudentIds([]);
                    } else {
                        console.error('שגיאה בטעינת התלמידות:', err);
                        setError('שגיאה בטעינת התלמידות');
                    }
                }


            } finally {
                setLoading(false);
            }
        };

        fetchSearchAndStudents();
    }, [id]);


    const handleDeleteStudentFromSearch = async (studentId) => {
        try {
            const schoolId = localStorage.getItem('schoolId');
            const searchParams = {
                myField: search.field,
                schoolId,
                count: 1,
                classes: search.classes ? JSON.parse(search.classes) : [],
                excludeIds: [...shownStudentIds, studentId]
            };

            const res = await axios.post(
                `${BASE_URL}students/params`,
                searchParams
            );

            const newStudent = res.data[0];

            const updatedStudents = students.filter(s => s.id !== studentId);
            setStudents([...updatedStudents, ...(newStudent ? [newStudent] : [])]);
            localStorage.setItem(`active_${id}`, JSON.stringify([...updatedStudents, ...(newStudent ? [newStudent] : [])].map(s => s.id)));

            if (newStudent) {
                const updatedAll = [...shownStudentIds, newStudent.id];
                setAllShownStudents(prev => [...prev.filter(s => s.id !== studentId), newStudent]);
                setShownStudentIds(updatedAll);
                localStorage.setItem(`shown_${id}`, JSON.stringify(updatedAll));
            }

            if (!newStudent) alert("אין עוד תלמידות מתאימות לפרמטרים");

        } catch (err) {
            console.error('שגיאה בהבאת תלמידה חלופית:', err);
            alert(err.response?.data || err.message);
        }
    };

    const handleFinalSave = async () => {
        try {
            const studentsIds = students.map(s => s.id);
            await axios.post(`${BASE_URL}stuInSea/${id}`, { studentsid: JSON.stringify(studentsIds) });
            alert('התלמידות נשמרו בהצלחה!');
            navigate('../../data-fetch')
        } catch (err) {
            console.error('שגיאה בשמירה הסופית:', err.response?.data || err.message);
            alert(err.response?.data || err.message);
        }
    };

    const handleSendApprovalEmail = async () => {
        try {
            const schoolId = localStorage.getItem('schoolId');
            const emailRes = await axios.get(`${BASE_URL}schools/${schoolId}`);
            const recipientEmail = emailRes.data[0].emailaddress;
            const studentsIds = students.map(s => s.id);
            const emailContent = {
                to: recipientEmail,
                subject: `אישור חיפוש - ${search.searchname}`,
                students: students,
            };
            console.log(emailContent);
            await axios.post(
                `${BASE_URL}searches/send-approval-mail/${id}/school/${schoolId}`,
                emailContent
            );
            setMailSent(true);
            navigate('../../data-fetch')
        } catch (err) {
            console.error('שגיאה בשליחת המייל:', err.response?.data);
            alert('שגיאה בשליחת המייל');
        }
    };

    const loadMoreStudents = async () => {
        try {
            const schoolId = localStorage.getItem('schoolId');
            const searchParams = {
                myField: search.field,
                schoolId,
                count: search.countstudents,
                classes: search.classes ? JSON.parse(search.classes) : [],
                excludeIds: shownStudentIds
            };

            const resStudents = await axios.post(
                `${BASE_URL}students/params`,
                searchParams
            );
            const newStudents = resStudents.data;
            const newIds = newStudents.map(s => s.id);
            const updatedAll = [...shownStudentIds, ...newIds];
            const updatedActive = [...students, ...newStudents];

            setStudents(updatedActive);
            setAllShownStudents(prev => [...prev, ...newStudents]);
            setShownStudentIds(updatedAll);
            localStorage.setItem(`shown_${id}`, JSON.stringify(updatedAll));
            localStorage.setItem(`active_${id}`, JSON.stringify(updatedActive.map(s => s.id)));

        } catch (err) {
            console.error('שגיאה בשליפת תלמידות נוספות:', err);
            alert('שגיאה בשליפת תלמידות נוספות');
        }
    };
    const waitTheSearch = async () => {
        navigate('../../data-fetch')
    }
    if (loading) return <Spinner animation="border" className="m-4" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    return (
        <Container className="mt-4">
            <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
                <h4>פרטי חיפוש: {search.searchname}</h4>
                <Button
                    onClick={() => navigate('../data-fetch')}
                    variant="outline-secondary"
                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                >
                    חזרה 👉
                </Button>
            </div>

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
                                <th>קוד תלמידה</th>
                                <th>שם פרטי</th>
                                <th>שם משפחה</th>
                                <th>כיתה</th>
                                <th>תחום 1</th>
                                <th>תחום 2</th>
                                <th>תחום 3</th>
                                <th>תחום 4</th>
                                <th>עדיפות כללית</th>
                                <th>מחק</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.id}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.firstname}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.lastname}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.class} {student.grade}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.field1priority) }}>{student.field1}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.field2priority) }}>{student.field2}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.field3priority) }}>{student.field3}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.field4priority) }}>{student.field4}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.severalpriority}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteStudentFromSearch(student.id)}
                                        >
                                            מחק
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="text-end d-flex justify-content-between mt-3">
                        <div>
                            <Button
                                variant="success"
                                onClick={handleSendApprovalEmail}
                                disabled={mailSent}
                                className="ms-2"
                            >
                                {mailSent ? 'המייל נשלח' : 'שלח מייל לאישור ושמירת החיפוש'}
                            </Button>
                            <Button variant="primary" onClick={handleFinalSave}>
                                שמירה סופית של החיפוש
                            </Button>
                            <Button variant="dark" onClick={waitTheSearch}>
                                השהיית החיפוש
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Container>
    );
};

export default SearchDetailsPage;

