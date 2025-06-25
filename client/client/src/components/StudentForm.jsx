import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';
const StudentForm = () => {

    const navigate = useNavigate();
    const [message, setMessage] = useState({ text: '', variant: '' });

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        id: '',
        class: '',
        grade: '',
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        schoolid: '',
        otherField1: '',
        otherField2: '',
        otherField3: '',
        otherField4: '',
    });

    const [classOptions, setClassOptions] = useState([]);

    const [fields, setFields] = useState([]);
    useEffect(() => {
        const fetchFieldsAndClasses = async () => {
            const schoolId = localStorage.getItem('schoolId');
            if (!schoolId) return;

            try {
                const response = await axios.get(`${BASE_URL}schools/${schoolId}`);
                const schoolFields = JSON.parse(response.data[0]?.fields);

                if (!schoolFields || schoolFields.length === 0) {
                    throw new Error("לא נמצאו תחומים לבית הספר הזה");
                }

                setFields(schoolFields);

                const localClasses = localStorage.getItem('classes');
                if (localClasses) {
                    setClassOptions(JSON.parse(localClasses));
                } else {
                    const res = await axios.get(`${BASE_URL}students/classes/${schoolId}`);
                    const classes = res.data || [];
                    localStorage.setItem('classes', JSON.stringify(classes));
                    setClassOptions(classes);
                }
            } catch (err) {
                console.error("שגיאה בטעינת התחומים או הכיתות:", err);
                alert("שגיאה בטעינת הנתונים. נסי לרענן את הדף או לבדוק את החיבור לשרת.");
            }
        };

        fetchFieldsAndClasses();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;

        // בדיקה אם מדובר בשדה תחום
        if (name.startsWith("field")) {
            const selectedValues = Object.entries(formData)
                .filter(([key]) => key.startsWith("field") && key !== name)
                .map(([_, val]) => val);

            if (selectedValues.includes(value)) {
                alert("אין אפשרות לבחור את אותו תחום פעמיים");
                return;
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const schoolId = localStorage.getItem('schoolId');
        const submissionData = {
            ...formData,
            schoolid: schoolId
        };

        // מחליפים "אחר" בטקסט החופשי
        for (let i = 1; i <= 4; i++) {
            const fieldKey = `field${i}`;
            const otherKey = `otherField${i}`;
            if (submissionData[fieldKey] === 'אחר' && submissionData[otherKey]) {
                submissionData[fieldKey] = submissionData[otherKey];
            }
            delete submissionData[otherKey];
        }

        try {
            await axios.post(`${BASE_URL}students/`, {
                ...submissionData,
                schoolId
            });

            setMessage({ text: 'התלמידה נוספה בהצלחה ✅', variant: 'success' });

            setFormData({
                firstname: '',
                lastname: '',
                id: '',
                class: '',
                grade: '',
                field1: '',
                field2: '',
                field3: '',
                field4: '',
                schoolid: '',
                otherField1: '',
                otherField2: '',
                otherField3: '',
                otherField4: '',
            });

            setTimeout(() => navigate('../staff-login'), 1500);
        } catch (error) {
            console.error('שגיאה בשליחה:', error);

            if (error.response?.status == 409) {
                setMessage({ text: '⚠️ תלמידה עם מספר זהות זה כבר קיימת במערכת.', variant: 'danger' });
            } else {
                setMessage({ text: '❌ שגיאה כללית בשליחה. נסי שוב או פני למנהלת המערכת.', variant: 'danger' });
            }
        }

    };

    const renderFieldSelect = (fieldName, otherFieldName) => {
        const selectedFields = Object.entries(formData)
            .filter(([key]) => key.startsWith("field") && key !== fieldName)
            .map(([_, val]) => val);

        const availableFields = fields?.filter(field => !selectedFields.includes(field)) || [];
        if (fields.length === 0) {
            return (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3">טוען תחומים...</p>
                </div>
            );
        }
        return (
            <>
                {message.text && (
                    <Alert variant={message.variant} className="text-center">
                        {message.text}
                    </Alert>
                )}
                <Form.Group className="mb-3">
                    <Form.Label>תחום</Form.Label>
                    <Form.Select
                        name={fieldName}
                        value={formData[fieldName]}
                        onChange={handleChange}
                    >
                        <option value="" disabled hidden>בחרי תחום</option>
                        {availableFields.map((field, i) => (
                            <option key={i} value={field}>{field}</option>
                        ))}
                        <option value="אחר">אחר</option>
                    </Form.Select>
                </Form.Group>
                {formData[fieldName] === 'אחר' && (
                    <Form.Control
                        type="text"
                        name={otherFieldName}
                        placeholder="כתבי את התחום האחר"
                        value={formData[otherFieldName]}
                        onChange={handleChange}
                        required
                    />
                )}
            </>
        );
    };


    return (
        <Container className="mt-5">
            <h2 className="mb-4 text-center">טופס הוספת תלמידה</h2>
            <Button variant='outline-secondary' onClick={() => navigate('../staff-login')}>חזרה לדף ההתחברות 👉</Button>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>שם פרטי *</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>שם משפחה *</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label> קוד תלמידה *</Form.Label>
                            <Form.Control
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={3}>
                        <Form.Group className="mb-3">
                            <Form.Label> כיתה *</Form.Label>
                            <Form.Select
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled hidden>בחרי כיתה</option>
                                <option value="ט">ט</option>
                                <option value="י">י</option>
                                <option value="יא">י"א</option>
                                <option value="יב">י"ב</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group className="mb-3">
                            <Form.Label>מספר כיתה *</Form.Label>
                            <Form.Control
                                type="text"
                                name="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                required
                                placeholder="לדוגמה: 3"
                            />
                        </Form.Group>
                    </Col>

                </Row>

                <h5 className="mt-4">תחומים</h5>
                {renderFieldSelect('field1', 'otherField1')}
                {renderFieldSelect('field2', 'otherField2')}
                {renderFieldSelect('field3', 'otherField3')}
                {renderFieldSelect('field4', 'otherField4')}

                <div className="text-center mt-4">
                    <Button variant="primary" type="submit">שלחי</Button>
                </div>
            </Form>
        </Container>
    );
};

export default StudentForm;
