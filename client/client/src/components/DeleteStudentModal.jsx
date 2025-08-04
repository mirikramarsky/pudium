import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../config';

const DeleteStudentModal = ({ show, onHide }) => {
    const [id, setId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [grade, setGrade] = useState('');
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const schoolId = localStorage.getItem('schoolId');
    const inputRef = useRef(null);

    useEffect(() => {
        if (show) {
            inputRef.current?.focus();
            setStudents([]);
            setSuccess('');
            setError('');
        }
    }, [show]);
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (id || firstName || lastName || studentClass || grade) handleSearch();
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [id, firstName, lastName, studentClass, grade]);

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
            }else if (id.trim()) {
                const theId = id.trim();
                endpoint = `${BASE_URL}students/schoolId/${theId}`;
                postData = { schoolId: schoolId};
            }
            else {
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

            if (id.trim() && endpoint.indexOf('id') === -1) {
                filtered = filtered.filter(s => s.id === id.trim());
            }

            if (grade.trim()) {
                const gradeNum = Number(grade.trim());
                filtered = filtered.filter(s => Number(s.grade) === gradeNum);
            }
            setStudents(filtered);
        } catch (err) {
            setError('שגיאה בשליפת תלמידות: ' + (err.response?.data || err.message));
        }
    };



    const handleDelete = async (studentId) => {
        if (!window.confirm('האם את בטוחה שברצונך למחוק את התלמידה?')) return;
        try {
            await axios.delete(`${BASE_URL}students/${studentId}`);
            setSuccess('התלמידה נמחקה בהצלחה');
            setStudents(students.filter(s => s.id !== studentId));
        } catch (err) {
            setError('שגיאה במחיקת תלמידה');
        }
    };
    const handleClose = () => {
        setId(''); setFirstName(''); setLastName('');
        setStudentClass(''); setGrade(''); setStudents([]);
        setError(''); setSuccess('');
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>🔍 מחיקת תלמידה לפי פרטים</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>תעודת זהות</Form.Label>
                        <Form.Control
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            ref={inputRef}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>שם פרטי</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>שם משפחה</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>כיתה</Form.Label>
                        <Form.Control
                            type="text"
                            value={studentClass}
                            onChange={(e) => setStudentClass(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>מספר כיתה</Form.Label>
                        <Form.Control
                            type="number"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        />
                    </Form.Group>
                </Form>

                {students.length > 0 && (
                    <>
                        <h6>תלמידות תואמות:</h6>
                        <Row>
                            {students.map((s) => (
                                <Col xs={12} key={s.id} className="mb-2">
                                    <div className="d-flex justify-content-between align-items-center border rounded p-2">
                                        <div>
                                            {s.firstname} {s.lastname} ({s.class}{s.grade}) | {s.id}
                                        </div>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>
                                            מחקי
                                        </Button>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    ביטול
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteStudentModal;