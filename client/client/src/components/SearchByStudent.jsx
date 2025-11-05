import React, { useEffect, useRef, useState } from 'react';
import { Container, Form, Button, Alert, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';

const SearchByStudent = () => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentSearches, setStudentSearches] = useState([]);
    const [fieldOptions, setFieldOptions] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [grade, setGrade] = useState('');
    const [foundStudents, setFoundStudents] = useState([]);
    const [schoolId] = useState(localStorage.getItem('schoolId') || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [currentYearSearches, setCurrentYearSearches] = useState([]);
    const [pastYearsSearches, setPastYearsSearches] = useState([]);
    const inputRef = useRef(null); // יצירת ref לשדה הקלט

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                inputRef.current?.focus(); // קביעת פוקוס אוטומטי כשנטען
                const schoolId = localStorage.getItem("schoolId");
                if (!schoolId) return;
                const response = await axios.get(`${BASE_URL}schools/${schoolId}`);
                const schoolFields = JSON.parse(response.data[0]?.fields || []);
                setFieldOptions(schoolFields);
            } catch (err) {
                console.error(err);
                setError('שגיאה בטעינת התחומים');
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!selectedStudent && (firstName.trim() || lastName.trim() || studentClass.trim() || grade.trim())) {
                handleSearch();
            }

        }, 300);
        return () => clearTimeout(timeout);
    }, [lastName, firstName, studentClass, grade]);


    const handleSearch = async () => {
        setError('');
        try {
            let baseStudents = [];
            let endpoint = '';
            let postData = {};

            if (lastName.trim()) {
                endpoint = `${BASE_URL}students/lastname/${schoolId}`;
                postData = { lastname: lastName.trim() };
            } else if (firstName.trim()) {
                endpoint = `${BASE_URL}students/firstname/${schoolId}`;
                postData = { firstname: firstName.trim() };
            } else if (studentClass.trim()) {
                endpoint = `${BASE_URL}students/class/${schoolId}`;
                postData = { class: studentClass.trim() };
            } else {
                setError('יש למלא לפחות שדה אחד לחיפוש');
                return;
            }

            const res = await axios.post(endpoint, postData);
            baseStudents = res.data || [];

            // סינון על תוצאה קיימת לפי שאר פרמטרים
            let filtered = [...baseStudents];

            if (firstName.trim() && endpoint.indexOf('firstname') === -1) {
                filtered = filtered.filter(s => s.firstname?.includes(firstName.trim()));
            }

            if (lastName.trim() && endpoint.indexOf('lastname') === -1) {
                filtered = filtered.filter(s => s.lastname?.includes(lastName.trim()));
            }

            if (studentClass.trim() && endpoint.indexOf('class') === -1) {
                filtered = filtered.filter(s => s.class === studentClass.trim());
            }

            if (grade.trim()) {
                const gradeNum = Number(grade.trim());
                filtered = filtered.filter(s => Number(s.grade) === gradeNum);
            }

            setFoundStudents(filtered);
        } catch (err) {
            setError('שגיאה בשליפת תלמידות: ' + (err.response?.data || err.message));
        }
    };


    const addStudent = async (student) => {
        setSelectedStudent(student);
        setFoundStudents([]);
        setFirstName(student.firstname || '');
        setLastName(student.lastname || '');
        setStudentClass(student.class || '');
        setGrade(student.grade?.toString() || '');
        try {
            const res = await axios.get(`${BASE_URL}searches/student/${student.id}`);
            console.log('חיפושים של התלמידה:', res.data);
            setStudentSearches(res.data);
            sortSearches(res.data);
        } catch (err) {
            console.error('שגיאה בשליפת חיפושים:', err);
            setError('לתלמידה אין חיפושים שמורים');
        }
    };
    const sortSearches = (searches) => {
        const now = new Date();
        let schoolYearStart, schoolYearEnd;
        if (now.getMonth() >= 8) {
            schoolYearStart = new Date(now.getFullYear(), 8, 1);
            schoolYearEnd = new Date(now.getFullYear() + 1, 7, 31, 23, 59, 59);
        } else {
            schoolYearStart = new Date(now.getFullYear() - 1, 8, 1);
            schoolYearEnd = new Date(now.getFullYear(), 7, 31, 23, 59, 59);
        }

        const current = searches.filter(s => {
            const d = new Date(s.searchdate);
            return d >= schoolYearStart && d <= schoolYearEnd;
        });

        const past = searches.filter(s => {
            const d = new Date(s.searchdate);
            return d < schoolYearStart;
        });

        setCurrentYearSearches(current);
        setPastYearsSearches(past);
    };

    return (
        <Container className="mt-4">
            <div style={{ textAlign: 'right' }}>
                <Button variant="outline-secondary" onClick={() => navigate('../recent-searches')}>
                    חזרה 👉
                </Button>
            </div>
            <h3>חיפוש לפי תלמידות </h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>שם פרטי</Form.Label>
                    <Form.Control
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        ref={inputRef}
                        isabled={!!selectedStudent}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>שם משפחה</Form.Label>
                    <Form.Control
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        isabled={!!selectedStudent}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>כיתה (ט'-י"ב)</Form.Label>
                    <Form.Control
                        type="text"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        isabled={!!selectedStudent}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>מספר כיתה </Form.Label>
                    <Form.Control
                        type="number"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        min="1"
                        max="20"
                        isabled={!!selectedStudent}
                    />
                </Form.Group>
                {selectedStudent && (
                    <Button variant="warning" onClick={() => {
                        setSelectedStudent(null);
                        setStudentSearches([]);
                        setCurrentYearSearches([]);
                        setPastYearsSearches([]);
                        setFirstName('');
                        setLastName('');
                        setStudentClass('');
                        setGrade('');
                    }}>
                        שינוי תלמידה
                    </Button>
                )}

                {foundStudents.length > 0 && (
                    <>
                        <h5>תלמידות זמינות</h5>
                        <Row>
                            {foundStudents.map((s) => (
                                <Col xs={6} md={4} lg={3} key={s.id} className="mb-2">
                                    <Button
                                        variant="outline-primary"
                                        className="w-100"
                                        onClick={() => addStudent(s)}
                                    >
                                        {s.firstname} {s.lastname} ({s.class}{s.grade})
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
                {studentSearches.length > 0 && (
                    <>
                        <h5>חיפושים בשנת הלימודים הנוכחית</h5>
                        {currentYearSearches.length > 0 ? (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>שם החיפוש</th>
                                        <th>מחפשת</th>
                                        <th>תחום</th>
                                        <th>כיתות</th>
                                        <th>כמות</th>
                                        <th>תאריך</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentYearSearches.map(search => (
                                        <tr key={search.id} onClick={() => navigate(`/search-result-not-to-edit/${search.id}`)}
                                            style={{ cursor: 'pointer' }}>
                                            <td>{search.searchname}</td>
                                            <td>{search.searchername}</td>
                                            <td>{search.field}</td>
                                            <td>
                                                {(() => {
                                                    try {
                                                        const parsed = JSON.parse(search.classes);
                                                        if (!Array.isArray(parsed)) return '';

                                                        const allClasses = JSON.parse(localStorage.getItem('classes') || '[]');
                                                        const classesByGroup = {};

                                                        allClasses.forEach(cls => {
                                                            const match = cls.match(/^([א-ת]{1,2})/);
                                                            const group = match ? match[1] : cls;
                                                            if (!classesByGroup[group]) classesByGroup[group] = [];
                                                            classesByGroup[group].push(cls);
                                                        });

                                                        const resultGroups = [];
                                                        const remainingClasses = [];

                                                        Object.entries(classesByGroup).forEach(([group, classList]) => {
                                                            const allInSearch = classList.every(cls => parsed.includes(cls));
                                                            if (allInSearch) {
                                                                resultGroups.push(group);
                                                            } else {
                                                                const partial = classList.filter(cls => parsed.includes(cls));
                                                                remainingClasses.push(...partial);
                                                            }
                                                        });

                                                        return [...resultGroups, ...remainingClasses].join(', ');
                                                    } catch (e) {
                                                        return '';
                                                    }
                                                })()}
                                            </td>
                                            <td>{search.countstudents}</td>
                                            <td>{new Date(search.searchdate).toLocaleString('he-IL')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : <p>אין חיפושים לשנה זו</p>}

                        <h5>חיפושים משנים קודמות</h5>
                        {pastYearsSearches.length > 0 ? (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>שם החיפוש</th>
                                        <th>מחפשת</th>
                                        <th>תחום</th>
                                        <th>כיתות</th>
                                        <th>כמות</th>
                                        <th>תאריך</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastYearsSearches.map(search => (
                                        <tr key={search.id} onClick={() => navigate(`/search-result-not-to-edit/${search.id}`)}
                                            style={{ cursor: 'pointer' }}>
                                            <td>{search.searchname}</td>
                                            <td>{search.searchername}</td>
                                            <td>{search.field}</td>
                                            <td>
                                                {(() => {
                                                    try {
                                                        const parsed = JSON.parse(search.classes);
                                                        if (!Array.isArray(parsed)) return '';

                                                        const allClasses = JSON.parse(localStorage.getItem('classes') || '[]');
                                                        const classesByGroup = {};

                                                        allClasses.forEach(cls => {
                                                            const match = cls.match(/^([א-ת]{1,2})/);
                                                            const group = match ? match[1] : cls;
                                                            if (!classesByGroup[group]) classesByGroup[group] = [];
                                                            classesByGroup[group].push(cls);
                                                        });

                                                        const resultGroups = [];
                                                        const remainingClasses = [];

                                                        Object.entries(classesByGroup).forEach(([group, classList]) => {
                                                            const allInSearch = classList.every(cls => parsed.includes(cls));
                                                            if (allInSearch) {
                                                                resultGroups.push(group);
                                                            } else {
                                                                const partial = classList.filter(cls => parsed.includes(cls));
                                                                remainingClasses.push(...partial);
                                                            }
                                                        });

                                                        return [...resultGroups, ...remainingClasses].join(', ');
                                                    } catch (e) {
                                                        return '';
                                                    }
                                                })()}
                                            </td>
                                            <td>{search.countstudents}</td>
                                            <td>{new Date(search.searchdate).toLocaleString('he-IL')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : <p>אין חיפושים משנים קודמות</p>}
                    </>
                )}

            </Form>
        </Container>
    );
};

export default SearchByStudent;
