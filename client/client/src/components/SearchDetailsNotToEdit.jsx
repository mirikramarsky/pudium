import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Table, Alert, Spinner, Row, Col, Card, Button } from 'react-bootstrap';

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

const SearchDetailsNotToEdit = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const { id } = useParams();
    const [search, setSearch] = useState(null);
    const [students, setStudents] = useState([]);
    const [shownStudentIds, setShownStudentIds] = useState([]);
    const [allShownStudents, setAllShownStudents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [mailSent, setMailSent] = useState(false);

    useEffect(() => {
        const fetchSearchAndStudents = async () => {
            try {
                const schoolId = localStorage.getItem('schoolId');
                if (!schoolId) {
                    setError('קוד מוסד לא נמצא. אנא התחבר מחדש.');
                    setLoading(false);
                    return;
                }

                const resSearch = await axios.get(`${BASE_URL}searches/${id}`);
                const searchData = resSearch.data[0];
                setSearch(searchData);

                const allShownKey = `shown_${id}`;
                const activeKey = `active_${id}`;
                const savedAllShown = JSON.parse(localStorage.getItem(allShownKey) || '[]');
                const savedActive = JSON.parse(localStorage.getItem(activeKey) || '[]');

                if (savedAllShown.length > 0 && savedActive.length > 0) {
                    const resAllStudents = await axios.get(`${BASE_URL}students/`);
                    const allStudents = resAllStudents.data;
                    const filteredActive = allStudents.filter(s => savedActive.includes(s.id));
                    const filteredAll = allStudents.filter(s => savedAllShown.includes(s.id));
                    setStudents(filteredActive);
                    setAllShownStudents(filteredAll);
                    setShownStudentIds(savedAllShown);
                } else {
                    const searchParams = {
                        myField: searchData.field,
                        schoolId,
                        count: searchData.countstudents,
                        classes: searchData.classes ? JSON.parse(searchData.classes) : [],
                        excludeIds: []
                    };

                    const resStudents = await axios.post(
                        '${BASE_URL}students/params',
                        searchParams
                    );
                    const foundStudents = resStudents.data;
                    const newIds = foundStudents.map(s => s.id);
                    setStudents(foundStudents);
                    setAllShownStudents(foundStudents);
                    setShownStudentIds(newIds);
                    localStorage.setItem(allShownKey, JSON.stringify(newIds));
                    localStorage.setItem(activeKey, JSON.stringify(newIds));
                }

            } catch (err) {
                console.error('שגיאה בטעינה:', err);
                setError('שגיאה בטעינת החיפוש או התלמידות');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchAndStudents();
    }, [id]);
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
                                <th>עדיפות כללית</th>
                                <th>תחום 4</th>
                                <th>תחום 3</th>
                                <th>תחום 2</th>
                                <th>תחום 1</th>
                                <th>כיתה</th>
                                <th>שם משפחה</th>
                                <th>שם פרטי</th>
                                <th>קוד תלמידה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.severalpriority}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.field4priority) }}>{student.field4}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.field3priority) }}>{student.field3}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.field2priority) }}>{student.field2}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.field1priority) }}>{student.field1}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.class} {student.grade}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.lastname}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.firstname}</td>
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.id}</td>
                                </tr>
                            ))}
                        </tbody>

                    </Table>
                    <div className="mt-3">
                        <Button variant='info' onClick={() => navigate('../data-fetch')}>חזור👈</Button>
                    </div>
                </>
            )}
        </Container>
    );
};

export default SearchDetailsNotToEdit;

