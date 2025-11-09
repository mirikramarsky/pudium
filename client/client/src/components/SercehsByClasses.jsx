import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

const SearchesByClasses = () => {
    const [loading, setLoading] = useState(true);
    const { grade, class: className } = useParams();
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    let maxSearches = 0;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true); // התחל טעינה
            const schoolId = localStorage.getItem('schoolId');
            if (!schoolId) {
                setError('קוד מוסד לא נמצא. אנא התחבר מחדש.');
                setLoading(false); // סיים טעינה גם במקרה של שגיאה
                return;
            }

            try {
                const response = await axios.get(`${BASE_URL}students/`);
                const filtered = response.data.filter(s =>
                    s.schoolid === Number(schoolId) &&
                    s.grade === Number(grade) &&
                    s.class === className
                );
                for (let student of filtered) {
                    try {
                        const searchesRes = await axios.get(`${BASE_URL}stuInSea/student/${student.id}`);
                        student.searches = [];

                        let i = 0;
                        for (let search of searchesRes.data) {
                            try {
                                const searchDetails = await axios.get(`${BASE_URL}searches/${search.searchid}`);
                                console.log("searchDetails", searchDetails.data);

                                student.searches[i++] = {
                                    name: searchDetails.data.searchname,
                                    field: searchDetails.data.field
                                };
                            } catch (err) {
                                console.error(`שגיאה בשליפת פרטי חיפוש עבור תלמיד ${student.id}:`, err);
                            }
                        }
                    } catch (err) {
                        if (err.response && err.response.status === 400) {
                            // אין חיפושים => מערך ריק
                            student.searches = [];
                        } else {
                            // console.error(`שגיאה בשליפת חיפושים עבור תלמיד ${student.id}:`, err);
                            student.searches = [];
                        }
                    }
                }

                setStudents(filtered);
            } catch (err) {
                setError('שגיאה בשליפת תלמידות');
                console.error(err);
            } finally {
                setLoading(false); // תמיד סיים טעינה
            }
        };

        fetchStudents();
    }, [grade, className]);
    console.log("students", students);
    maxSearches = Math.max(...students.map(s => s.searches.length));
    console.log("maxSearches", maxSearches);
    if (error) return (
        <Container className="mt-4" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
                <Button
                    onClick={() => navigate('../classes')}
                    variant="outline-secondary"
                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                >
                    חזרה 👉
                </Button>
            </div><Alert variant="danger">{error}</Alert>
        </Container>);

    return (
        <Container className="mt-4">
            <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
                <h3>תלמידות בכיתה {className} {grade}</h3>
                <Button
                    onClick={() => navigate('../classes')}
                    variant="outline-secondary"
                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                >
                    חזרה 👉
                </Button>
            </div>
            {loading ? (
                <p>טוען תלמידות...</p>
            ) : students.length === 0 ? (
                <p>אין תלמידות בכיתה זו.</p>
            ) : (
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>מספר זהות</th>
                            <th>שם פרטי</th>
                            <th>שם משפחה</th>
                            <th>כיתה</th>
                            {Array.from({ length: maxSearches }).map((_, idx) => (
                                <th key={idx}>חיפוש {idx + 1}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => {
                            return (
                                <tr
                                    key={student.id}
                                    style={{ backgroundColor: '#ffff', cursor: 'pointer' }}
                                >
                                    <td >{student.id}</td>
                                    <td >{student.firstname}</td>
                                    <td>{student.lastname}</td>
                                    <td >{student.class} {student.grade}</td>
                                    {Array.from({ length: maxSearches }).map((_, idx) => {
                                        const search = student.searches[idx];
                                        return (
                                            <td key={idx}>
                                                {search ? `${search.name} - ${search.field}` : '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default SearchesByClasses;
