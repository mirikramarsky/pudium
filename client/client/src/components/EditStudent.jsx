import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const EditStudent = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudent = async () => {
            const schoolid = localStorage.getItem('schoolId');
            if (!schoolid) {
                setError('קוד מוסד לא נמצא. אנא התחבר מחדש.');
                return;
            }

            try {
                const response = await axios.post(
                    `https://pudium-production.up.railway.app/api/podium/students/${id}`,
                    { schoolId: Number(schoolid) }
                );
                const student = response.data;
                if (!student) {
                    setError('תלמידה לא נמצאה');
                    return;
                }
                console.log(student[0]);
                
                setFormData(student[0]);
            } catch (err) {
                setError('שגיאה בשליפת תלמידה');
                console.error(err);
            }
        };

        fetchStudent();
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            console.log(formData);
            await axios.put(
                `https://pudium-production.up.railway.app/api/podium/students/${id}`,
                formData
            );
            alert('עודכן בהצלחה');
            navigate(-1);
        } catch (err) {
            setError('שגיאה בעדכון');
            console.error(err);
        }
    };

    if (error) return <Alert variant="danger">{error}</Alert>;

    if (!formData) return <p>טוען...</p>;

    return (
        <Container className="mt-4">
            <h3>עריכת תלמידה - {formData.firstname} {formData.lastname}</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>שם פרטי</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstname"
                        value={formData?.firstname || ''}
                        placeholder={formData?.firstname || 'שם פרטי'}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>שם משפחה</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastname"
                        value={formData.lastname || ''}
                        placeholder={formData.lastname || 'שם משפחה'}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>מספר זהות</Form.Label>
                    <Form.Control
                        type="text"
                        name="id"
                        value={formData.id || ''}
                        placeholder={formData.id || 'מספר זהות'}
                        onChange={handleChange}
                        disabled
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>כיתה</Form.Label>
                    <Form.Control
                        type="text"
                        name="grade"
                        value={formData.grade || ''}
                        placeholder={formData.grade || 'כיתה'}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>עדיפות כללית</Form.Label>
                    <Form.Control
                        type="number"
                        name="severalpriority"
                        value={formData.severalpriority || ''}
                        placeholder={formData.severalpriority !== undefined ? formData.severalpriority.toString() : 'עדיפות כללית'}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>תחום 1</Form.Label>
                    <Form.Control
                        type="text"
                        name="field1"
                        value={formData.field1 || ''}
                        placeholder={formData.field1 || 'תחום 1'}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>עדיפות תחום 1</Form.Label>
                    <Form.Control
                        type="number"
                        name="field1priority"
                        value={formData.field1priority || ''}
                        placeholder={formData.field1priority !== undefined ? formData.field1priority.toString() : 'עדיפות תחום 1'}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>תחום 2</Form.Label>
                    <Form.Control
                        type="text"
                        name="field2"
                        value={formData.field2 || ''}
                        placeholder={formData.field2 || 'תחום 2'}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>עדיפות תחום 2</Form.Label>
                    <Form.Control
                        type="number"
                        name="field2priority"
                        value={formData.field2priority || ''}
                        placeholder={formData.field2priority !== undefined ? formData.field2priority.toString() : 'עדיפות תחום 2'}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>תחום 3</Form.Label>
                    <Form.Control
                        type="text"
                        name="field3"
                        value={formData.field3 || ''}
                        placeholder={formData.field3 || 'תחום 3'}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>עדיפות תחום 3</Form.Label>
                    <Form.Control
                        type="number"
                        name="field3priority"
                        value={formData.field3priority || ''}
                        placeholder={formData.field3priority !== undefined ? formData.field3priority.toString() : 'עדיפות תחום 3'}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>תחום 4</Form.Label>
                    <Form.Control
                        type="text"
                        name="field4"
                        value={formData.field4 || ''}
                        placeholder={formData.field4 || 'תחום 4'}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>עדיפות תחום 4</Form.Label>
                    <Form.Control
                        type="number"
                        name="field4priority"
                        value={formData.field4priority || ''}
                        placeholder={formData.field4priority !== undefined ? formData.field4priority.toString() : 'עדיפות תחום 4'}
                        onChange={handleChange}
                    />
                </Form.Group>
                {/* ניתן להוסיף כאן שדות נוספים */}

                <Button type="submit" variant="primary">שמור</Button>
            </Form>
        </Container>
    );
};

export default EditStudent;
