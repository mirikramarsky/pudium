import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../config';

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
                    `${BASE_URL}students/schoolid/${id}`,
                    { schoolId: Number(schoolid) }
                );
                const student = response.data;
                if (!student) {
                    setError('תלמידה לא נמצאה');
                    return;
                }
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
            await axios.put(
                `${BASE_URL}students/${id}`,
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
                        value={formData.firstname || ''}
                        placeholder="שם פרטי"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>שם משפחה</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastname"
                        value={formData.lastname || ''}
                        placeholder="שם משפחה"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>מספר זהות</Form.Label>
                    <Form.Control
                        type="text"
                        name="id"
                        value={formData.id || ''}
                        placeholder="מספר זהות"
                        disabled
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>אות כיתה</Form.Label>
                    <Form.Select
                        name="class"
                        value={formData.class || ''}
                        onChange={handleChange}
                    >
                        <option value="">בחר אות כיתה</option>
                        {/* שישלוף מהאותיות הקיימות באותו בית הספר? */}
                        <option value="א">א'</option>
                        <option value="ב">ב'</option>
                        <option value="ג">ג'</option>
                        <option value="ד">ד'</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>מספר כיתה</Form.Label>
                    <Form.Control
                        type="text"
                        name="grade"
                        value={formData.grade || ''}
                        placeholder="מספר כיתה (9, 10, 11 ...)"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>עדיפות כללית</Form.Label>
                    <Form.Control
                        type="number"
                        name="severalpriority"
                        value={formData.severalpriority || ''}
                        placeholder="עדיפות כללית"
                        onChange={handleChange}
                    />
                </Form.Group>
                {/* שדות תחומים ועוד כמו קודם */}
                <Form.Group className="mb-3">
                    <Form.Label>תחום 1</Form.Label>
                    <Form.Control
                        type="text"
                        name="field1"
                        value={formData.field1 || ''}
                        placeholder="תחום 1"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>עדיפות תחום 1</Form.Label>
                    <Form.Control
                        type="number"
                        name="field1priority"
                        value={formData.field1priority || ''}
                        placeholder="עדיפות תחום 1"
                        onChange={handleChange}
                    />
                </Form.Group>
                {/* ... שדות נוספים כמו שהיו קודם ... */}
                <Form.Group className="mb-3">
                    <Form.Label>תחום 2</Form.Label>
                    <Form.Control
                        type="text"
                        name="field2"
                        value={formData.field2 || ''}
                        placeholder="תחום 2"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>עדיפות תחום 2</Form.Label>
                    <Form.Control
                        type="number"
                        name="field2priority"
                        value={formData.field2priority || ''}
                        placeholder="עדיפות תחום 2"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>תחום 3</Form.Label>
                    <Form.Control
                        type="text"
                        name="field3"
                        value={formData.field3 || ''}
                        placeholder="תחום 3"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>עדיפות תחום 3</Form.Label>
                    <Form.Control
                        type="number"
                        name="field3priority"
                        value={formData.field3priority || ''}
                        placeholder="עדיפות תחום 3"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>תחום 4</Form.Label>
                    <Form.Control
                        type="text"
                        name="field4"
                        value={formData.field4 || ''}
                        placeholder="תחום 4"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>עדיפות תחום 4</Form.Label>
                    <Form.Control
                        type="number"
                        name="field4priority"
                        value={formData.field4priority || ''}
                        placeholder="עדיפות תחום 4"
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>עדיפות חינוכית</Form.Label>
                    <Form.Select
                        name="educpriority"
                        value={formData.educpriority ? "true" : "false"}
                        onChange={e =>
                            setFormData(prev => ({
                                ...prev,
                                educpriority: e.target.value === "true"
                            }))
                        }
                    >
                        <option value="false">לא</option>
                        <option value="true">כן</option>
                    </Form.Select>
                </Form.Group>


                <Button type="submit" variant="primary">שמור</Button>
            </Form>
        </Container>
    );
};

export default EditStudent;
