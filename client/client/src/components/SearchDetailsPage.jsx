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
    const [managerEmails, setManagerEmails] = useState({});
    const [search, setSearch] = useState(null);
    const [students, setStudents] = useState([]);
    const [shownStudentIds, setShownStudentIds] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [mailSent, setMailSent] = useState(false);
    const urlParams = new URLSearchParams(window.location.search);
    const schoolIdFromUrl = urlParams.get('schoolId');

    if (schoolIdFromUrl) {
        localStorage.setItem('schoolId', schoolIdFromUrl);
    }
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleFinalSave();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [students]); // יופעל כל עוד רשימת התלמידות מעודכנת

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
                if (!Array.isArray(searchData.students.students)) {
                    searchData.students.students = [];
                }
                setSearch(searchData);
                console.log("searchData", searchData);

                // שלב 1 - אם קיימים תלמידות בשדה students של החיפוש
                if (searchData.students && searchData.students.students.length > 0) {
                    const fetchedIds = searchData.students.students;
                    const resStudents = await axios.post(
                        `${BASE_URL}students/students/${schoolId}`,
                        { studentIds: JSON.stringify(fetchedIds) }
                    );
                    setStudents(resStudents.data);
                    setShownStudentIds(fetchedIds);
                    setLoading(false);
                    return;
                }
                try {
                    const resStudents = await axios.get(`${BASE_URL}stuInSea/search/${id}/${schoolId}`);
                    const studentsFromServer = resStudents.data;

                    if (studentsFromServer.length > 0) {
                        const fetchedIds = studentsFromServer.map(s => s.id);
                        setStudents(studentsFromServer);
                        setShownStudentIds(fetchedIds);
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
                const searchParams = {
                    myField: searchData.field,
                    schoolId: Number(schoolId) || 0,
                    count: searchData.countstudents,
                    classes: searchData.classes ? JSON.parse(searchData.classes) : [],
                    excludeIds: []
                };
                console.log("searchParams2",searchParams);
                
                try {
                    const resStudents = await axios.post(
                        `${BASE_URL}students/params/toSave/`,
                        searchParams
                    );
                    console.log("searchParams response", resStudents);
                    
                    const foundStudents = resStudents.data;
                    const newIds = foundStudents.map(s => s.id);
                    setStudents(foundStudents);
                    setShownStudentIds(newIds);
                    await updateSearchStudents(newIds);
                } catch (err) {
                    if (err.response && err.response.status === 400) {
                        setError('לא נמצאו תלמידות תואמות לחיפוש הזה');
                        setStudents([]);
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
            console.log("searchParams",searchParams);
            
            const res = await axios.post(
                `${BASE_URL}students/params/toSave/`,
                searchParams
            );

            const newStudent = res.data[0];

            const updatedStudents = students.filter(s => s.id !== studentId);
            setStudents([...updatedStudents, ...(newStudent ? [newStudent] : [])]);


            if (newStudent) {
                const updatedAll = [...shownStudentIds.filter(id => id !== studentId), newStudent.id];
                setShownStudentIds(updatedAll);
                await updateSearchStudents(updatedAll);
            }
            if (!newStudent) {
                const updatedAll = shownStudentIds.filter(id => id !== studentId);
                await updateSearchStudents(updatedAll);
                alert("אין עוד תלמידות מתאימות לפרמטרים");
            }

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
            const rawEmailString = emailRes.data[0].emailaddress;
            const parsedArray = JSON.parse(rawEmailString); // מערך של אובייקטים [{ ... }, { ... }]

            // ממזגת את כל האובייקטים לאובייקט אחד
            const merged = Object.assign({}, ...parsedArray);

            if (!merged) {
                alert('לא נמצאו כתובות מייל');
                return;
            }

            if (typeof merged === 'object') {
                // יש יותר ממנהל אחד
                setManagerEmails(merged);
            } else {
                // רק מנהל אחד - שליחה אוטומטית
                await sendMailToRecipient(merged);
            }
        } catch (err) {
            console.error('שגיאה בשליחת המייל:', err.response?.data);
            alert('שגיאה בשליחת המייל');
        }
    };

    const sendMailToRecipient = async (email) => {
        try {
            console.log(email);
            const emailContent = {
                to: email,
                subject: `אישור חיפוש - ${search.searchname}`,
                students: students,
            };
            await axios.post(
                `${BASE_URL}searches/send-approval-mail/${id}/school/${localStorage.getItem('schoolId')}`,
                emailContent
            );
            setMailSent(true);
            setManagerEmails({}); // נקה את הרשימה אחרי השליחה
            navigate('../../data-fetch');
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
            console.log("searchParams",searchParams);
            
            const resStudents = await axios.post(
                `${BASE_URL}students/params/toSave/`,
                searchParams
            );
            const newStudents = resStudents.data;
            const newIds = newStudents.map(s => s.id);
            const updatedAll = [...shownStudentIds, ...newIds];
            const updatedActive = [...students, ...newStudents];

            setStudents(updatedActive);
            setShownStudentIds(updatedAll);
            await updateSearchStudents(updatedAll);
        } catch (err) {
            console.error('שגיאה בשליפת תלמידות נוספות:', err);
            alert('שגיאה בשליפת תלמידות נוספות');
        }
    };
    const waitTheSearch = async () => {
        navigate('../../data-fetch')
    }
    const updateSearchStudents = async (studentIds) => {
        console.log("studentIds: ",studentIds);
        
        await axios.put(`${BASE_URL}searches/${id}`, {
            students: {"students": studentIds }
        });
    };

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
                                {mailSent ? 'המייל נשלח' : 'שלח מייל למנהל לאישור ושמירת החיפוש'}
                            </Button>
                            {Object.keys(managerEmails).length > 0 && (
                                <div className="mt-3">
                                    <p>בחרי למי לשלוח את המייל:</p>
                                    {Object.entries(managerEmails).map(([name, email]) => (
                                        <Button
                                            key={name}
                                            className="me-2"
                                            variant="outline-primary"
                                            onClick={() => sendMailToRecipient(email)}
                                        >
                                            {name}
                                        </Button>
                                    ))}
                                </div>
                            )}

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

