// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Container, Table, Alert, Spinner, Row, Col, Card, Button } from 'react-bootstrap';

// const getPriorityColor = (priority) => {
//     switch (priority) {
//         case 0: return '#d3d3d3';
//         case 1: return 'white';
//         case 2: return '#e0f7fa';
//         case 3: return '#b2ebf2';
//         case 4: return '#81d4fa';
//         case 5: return '#4fc3f7';
//         case 6: return '#0288d1';
//         case 7: return '#9575cd';
//         case 8: return '#e57373';
//         default: return 'white';
//     }
// };

// const SearchDetailsPage = () => {
//     const { id } = useParams();
//     const [search, setSearch] = useState(null);
//     const [students, setStudents] = useState([]);
//     const [shownStudentIds, setShownStudentIds] = useState([]);
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [mailSent, setMailSent] = useState(false);

//     useEffect(() => {
//         const fetchSearchAndStudents = async () => {
//             try {
//                 const schoolId = localStorage.getItem('schoolId');
//                 if (!schoolId) {
//                     setError('קוד מוסד לא נמצא. אנא התחבר מחדש.');
//                     setLoading(false);
//                     return;
//                 }

//                 const resSearch = await axios.get(`https://pudium-production.up.railway.app/api/podium/searches/${id}`);
//                 const searchData = resSearch.data[0];
//                 setSearch(searchData);

//                 const savedIds = JSON.parse(sessionStorage.getItem(`shown-${id}`) || '[]');
//                 setShownStudentIds(savedIds);

//                 const searchParams = {
//                     myField: searchData.field,
//                     schoolId,
//                     count: searchData.countstudents,
//                     classes: searchData.classes ? JSON.parse(searchData.classes) : [],
//                     excludeIds: savedIds
//                 };

//                 const resStudents = await axios.post(
//                     'https://pudium-production.up.railway.app/api/podium/students/params',
//                     searchParams
//                 );
//                 const foundStudents = resStudents.data;

//                 // כאן צריך להגדיר את התלמידות ישירות, לא להוסיף
//                 setStudents(foundStudents);

//                 const newIds = foundStudents.map(s => s.id);
//                 const updatedIds = [...savedIds, ...newIds];
//                 setShownStudentIds(updatedIds);
//                 sessionStorage.setItem(`shown-${id}`, JSON.stringify(updatedIds));

//             } catch (err) {
//                 console.error('שגיאה בטעינה:', err);
//                 setError('שגיאה בטעינת החיפוש או התלמידות');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSearchAndStudents();
//     }, [id]);


//     const handleDeleteStudentFromSearch = async (studentSearchId, studentId) => {
//         try {
//             // 1. הסרת התלמידה מהטבלה
//             const updatedStudents = students.filter(s => s.id !== studentId);
//             setStudents(updatedStudents);

//             // 2. הסרה מה-sessionStorage
//             const updatedIds = shownStudentIds.filter(id => id !== studentId);
//             setShownStudentIds(updatedIds);
//             sessionStorage.setItem(`shown-${id}`, JSON.stringify(updatedIds));

//             // 3. שליפת תלמידה חדשה והוספה
//             const schoolId = localStorage.getItem('schoolId');
//             const searchParams = {
//                 myField: search.field,
//                 schoolId,
//                 count: 1,
//                 classes: search.classes ? JSON.parse(search.classes) : [],
//                 excludeIds: updatedIds
//             };

//             const res = await axios.post(
//                 'https://pudium-production.up.railway.app/api/podium/students/params',
//                 searchParams
//             );

//             console.log(res.data);
//             const newStudent = res.data[0];
//             if (newStudent) {
//                 setStudents(prev => [...prev, newStudent]);
//                 const newIds = [...updatedIds, newStudent.id];
//                 setShownStudentIds(newIds);
//                 sessionStorage.setItem(`shown-${id}`, JSON.stringify(newIds));
//             }
//             else {
//                 alert("אין עוד תלמידות מתאימות לפרמטרים");
//             }
//         } catch (err) {
//             console.error('שגיאה בהבאת תלמידה חלופית:', err);
//             alert('שגיאה בשליפת תלמידה חלופית');
//         }
//     };


//     const handleFinalSave = async () => {
//         try {
//             const payload = students.map(s => ({
//                 searchId: id,
//                 studentId: s.id
//             }));

//             const studentsIds = payload.map(s => s.studentId);
//             console.log(studentsIds);
//             await axios.post(`https://pudium-production.up.railway.app/api/podium/stuInSea/${id}`, { studentsid: studentsIds });
//             alert('התלמידות נשמרו בהצלחה!');
//         } catch (err) {
//             console.error('שגיאה בשמירה הסופית:', err);
//             alert('שגיאה בשמירה הסופית');
//         }
//     };

//     const handleSendApprovalEmail = async () => {
//         try {
//             const schoolId = localStorage.getItem('schoolId');
//             const emailRes = await axios.get(`https://pudium-production.up.railway.app/api/podium/schools/${schoolId}`);
//             const recipientEmail = emailRes.data[0].emailaddress;

//             const emailContent = {
//                 to: recipientEmail,
//                 subject: `אישור חיפוש - ${search.searchname}`,
//                 searchId: id,
//                 searchDetails: search,
//                 students,
//                 approveUrl: `https://pudium-production.up.railway.app/api/podium/approve/${id}`,/////////////////////////////////
//                 deleteUrl: `https://pudium-production.up.railway.app/api/podium/searches/${id}`,
//                 editUrl: `http://localhost:5173/search-results/${id}`//להחליף באתר האמיתי
//             };

//             await axios.post(`https://pudium-production.up.railway.app/api/podium/searches/send-approval-mail/${id}/school/${schoolId}`, emailContent);
//             setMailSent(true);
//         } catch (err) {
//             console.error('שגיאה בשליחת המייל:', err);
//             alert('שגיאה בשליחת המייל');
//         }
//     };

//     const loadMoreStudents = async () => {
//         try {
//             const schoolId = localStorage.getItem('schoolId');
//             const searchParams = {
//                 myField: search.field,
//                 schoolId,
//                 count: search.countstudents,
//                 classes: search.classes ? JSON.parse(search.classes) : [],
//                 excludeIds: shownStudentIds
//             };

//             const resStudents = await axios.post(
//                 'https://pudium-production.up.railway.app/api/podium/students/params',
//                 searchParams
//             );
//             const newStudents = resStudents.data;

//             const newIds = newStudents.map(s => s.id);
//             const updatedIds = [...shownStudentIds, ...newIds];
//             setStudents(prev => [...prev, ...newStudents]);
//             setShownStudentIds(updatedIds);
//             sessionStorage.setItem(`shown-${id}`, JSON.stringify(updatedIds));

//         } catch (err) {
//             console.error('שגיאה בשליפת תלמידות נוספות:', err);
//             alert('שגיאה בשליפת תלמידות נוספות');
//         }
//     };

//     if (loading) return <Spinner animation="border" className="m-4" />;
//     if (error) return <Alert variant="danger">{error}</Alert>;
//     if (!search) return <p>החיפוש לא נמצא</p>;
//     console.log(students);

//     return (
//         <Container className="mt-4">
//             <h4>פרטי חיפוש: {search.searchname}</h4>

//             <Card className="mb-4 p-3">
//                 <Row>
//                     <Col md={4}><strong>שם מחפשת:</strong> {search.searchername}</Col>
//                     <Col md={4}><strong>תחום:</strong> {search.field}</Col>
//                     <Col md={4}>
//                         <strong>כיתות:</strong>{' '}
//                         {search.classes ? JSON.parse(search.classes).join(', ') : '–'}
//                     </Col>
//                     <Col md={4}><strong>כמות תלמידות:</strong> {search.countstudents}</Col>
//                     <Col md={8}><strong>תאריך:</strong> {new Date(search.searchdate).toLocaleString('he-IL')}</Col>
//                 </Row>
//             </Card>

//             <h5>תלמידות:</h5>

//             {students.length === 0 ? (
//                 <p>לא נמצאו תלמידות בחיפוש זה</p>
//             ) : (
//                 <>
//                     <Table bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>מחק</th>
//                                 <th>עדיפות כללית</th>
//                                 <th>תחום 4</th>
//                                 <th>תחום 3</th>
//                                 <th>תחום 2</th>
//                                 <th>תחום 1</th>
//                                 <th>כיתה</th>
//                                 <th>שם משפחה</th>
//                                 <th>שם פרטי</th>
//                                 <th>קוד תלמידה</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {students.map(student => (
//                                 <tr key={student.id} style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>
//                                     <td>
//                                         <Button
//                                             variant="danger"
//                                             size="sm"
//                                             onClick={() => handleDeleteStudentFromSearch(student/**/, student.id)}
//                                         >
//                                             מחק
//                                         </Button>

//                                     </td>
//                                     <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.severalpriority}</td>
//                                     <td style={{ backgroundColor: getPriorityColor(student.field4priority) }}>{student.field4}</td>
//                                     <td style={{ backgroundColor: getPriorityColor(student.field3priority) }}>{student.field3}</td>
//                                     <td style={{ backgroundColor: getPriorityColor(student.field2priority) }}>{student.field2}</td>
//                                     <td style={{ backgroundColor: getPriorityColor(student.field1priority) }}>{student.field1}</td>
//                                     <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.class} {student.grade}</td>
//                                     <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.lastname}</td>
//                                     <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.firstname}</td>
//                                     <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.id}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>

//                     <div className="text-end d-flex justify-content-between mt-3">
//                         {/* <Button variant="secondary" onClick={loadMoreStudents}>שלוף עוד תלמידות</Button> */}
//                         <div>
//                             <Button
//                                 variant="success"
//                                 onClick={handleSendApprovalEmail}
//                                 disabled={mailSent}
//                                 className="ms-2"
//                             >
//                                 {mailSent ? 'המייל נשלח' : 'שלח מייל לאישור ושמירת החיפוש'}
//                             </Button>
//                             <Button variant="primary" onClick={handleFinalSave}>
//                                 שמירה סופית של החיפוש
//                             </Button>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </Container>
//     );
// };

// export default SearchDetailsPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Table, Alert, Spinner, Row, Col, Card, Button } from 'react-bootstrap';

const getPriorityColor = (priority) => {
    switch (priority) {
        case 0: return '#d3d3d3';
        case 1: return 'white';
        case 2: return '#e0f7fa';
        case 3: return '#b2ebf2';
        case 4: return '#81d4fa';
        case 5: return '#4fc3f7';
        case 6: return '#0288d1';
        case 7: return '#9575cd';
        case 8: return '#e57373';
        default: return 'white';
    }
};

const SearchDetailsPage = () => {
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

                const resSearch = await axios.get(`https://pudium-production.up.railway.app/api/podium/searches/${id}`);
                const searchData = resSearch.data[0];
                setSearch(searchData);

                const savedIds = JSON.parse(sessionStorage.getItem(`shown-${id}`) || '[]');
                setShownStudentIds(savedIds);

                const searchParams = {
                    myField: searchData.field,
                    schoolId,
                    count: searchData.countstudents,
                    classes: searchData.classes ? JSON.parse(searchData.classes) : [],
                    excludeIds: savedIds
                };
                console.log(searchParams);


                const resStudents = await axios.post(
                    'https://pudium-production.up.railway.app/api/podium/students/params',
                    searchParams
                );
                const foundStudents = resStudents.data;

                setStudents(foundStudents);
                setAllShownStudents(foundStudents);

                const newIds = foundStudents.map(s => s.id);
                const updatedIds = [...savedIds, ...newIds];
                setShownStudentIds(updatedIds);
                sessionStorage.setItem(`shown-${id}`, JSON.stringify(updatedIds));

            } catch (err) {
                console.log("❌ שגיאת שליחה:", err.response?.data || err.message);
                console.error('שגיאה בטעינה:', err);
                setError('שגיאה בטעינת החיפוש או התלמידות');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchAndStudents();
    }, [id]);

    const handleDeleteStudentFromSearch = async (student, studentId) => {
        try {
            const schoolId = localStorage.getItem('schoolId');

            // כאן את שולחת את excludeIds כולל התלמידה הנוכחית (שעדיין לא הוסרה)
            const searchParams = {
                myField: search.field,
                schoolId,
                count: 1,
                classes: search.classes ? JSON.parse(search.classes) : [],
                excludeIds: [...shownStudentIds, studentId]  // מוסיפה אותה רק לשליחה
            };

            const res = await axios.post(
                'https://pudium-production.up.railway.app/api/podium/students/params',
                searchParams
            );

            const newStudent = res.data[0];

            // ואז מעדכנת את המצביעים
            const updatedStudents = students.filter(s => s.id !== studentId);
            setStudents([...updatedStudents, ...(newStudent ? [newStudent] : [])]);

            const updatedIds = [...shownStudentIds, ...(newStudent ? [newStudent.id] : [])];
            setShownStudentIds(updatedIds);
            sessionStorage.setItem(`shown-${id}`, JSON.stringify(updatedIds));

            setAllShownStudents(prev => [
                ...prev.filter(s => s.id !== studentId),
                ...(newStudent ? [newStudent] : [])
            ]);

            if (!newStudent) {
                alert("אין עוד תלמידות מתאימות לפרמטרים");
            }

        } catch (err) {
            console.error('שגיאה בהבאת תלמידה חלופית:', err);
            alert( err.response?.data || err.message);
        }
    };


    const handleFinalSave = async () => {
        try {
            const studentsIds = students.map(s => s.id);
            console.log(studentsIds);
            console.log(JSON.stringify(studentsIds) );
            
            await axios.post(`https://pudium-production.up.railway.app/api/podium/stuInSea/${id}`, { studentsid: JSON.stringify(studentsIds) });
            alert('התלמידות נשמרו בהצלחה!');
        } catch (err) {
            console.error('שגיאה בשמירה הסופית:', err);
            alert('שגיאה בשמירה הסופית');
        }
    };

    const handleSendApprovalEmail = async () => {
        try {
            const schoolId = localStorage.getItem('schoolId');
            const emailRes = await axios.get(`https://pudium-production.up.railway.app/api/podium/schools/${schoolId}`);
            const recipientEmail = emailRes.data[0].emailaddress;

            const emailContent = {
                to: recipientEmail,
                subject: `אישור חיפוש - ${search.searchname}`,
                searchId: id,
                searchDetails: search,
                students,
                approveUrl: `https://pudium-production.up.railway.app/api/podium/approve/${id}`,
                deleteUrl: `https://pudium-production.up.railway.app/api/podium/searches/${id}`,
                editUrl: `http://localhost:5173/search-results/${id}`
            };

            await axios.post(`https://pudium-production.up.railway.app/api/podium/searches/send-approval-mail/${id}/school/${schoolId}`, emailContent);
            setMailSent(true);
        } catch (err) {
            console.error('שגיאה בשליחת המייל:', err);
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
                'https://pudium-production.up.railway.app/api/podium/students/params',
                searchParams
            );
            const newStudents = resStudents.data;

            const newIds = newStudents.map(s => s.id);
            const updatedIds = [...shownStudentIds, ...newIds];
            setStudents(prev => [...prev, ...newStudents]);
            setShownStudentIds(updatedIds);
            setAllShownStudents(prev => [...prev, ...newStudents]);
            sessionStorage.setItem(`shown-${id}`, JSON.stringify(updatedIds));

        } catch (err) {
            console.error('שגיאה בשליפת תלמידות נוספות:', err);
            alert('שגיאה בשליפת תלמידות נוספות');
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
                                <th>קוד תלמידה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteStudentFromSearch(student, student.id)}
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
                                    <td style={{ backgroundColor: getPriorityColor(student.severalpriority) }}>{student.id}</td>
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
                        </div>
                    </div>
                </>
            )}
        </Container>
    );
};

export default SearchDetailsPage;