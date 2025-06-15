import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const StudentForm = () => {
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

    const fields = ['ריקוד', 'שירה', 'אימון מחול', 'מחול', 'עריכה', 'תפאורה', 'אחר'];

    useEffect(() => {
        const schoolId = localStorage.getItem('schoolId');
        if (!schoolId) return;

        const localClasses = localStorage.getItem('classes');
        if (localClasses) {
            setClassOptions(JSON.parse(localClasses));
        } else {
            axios.get(`https://pudium-production.up.railway.app/api/podium/students/classes/${schoolId}`)
                .then(res => {
                    const classes = res.data || [];
                    localStorage.setItem('classes', JSON.stringify(classes));
                    setClassOptions(classes);
                })
                .catch(err => {
                    console.error('שגיאה בשליפת כיתות:', err);
                });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
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
            console.log(submissionData);
            await axios.post('https://pudium-production.up.railway.app/api/podium/students/', {
                ...submissionData,
                schoolId
            });
            alert('נשמר בהצלחה');

            // איפוס הטופס
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
        } catch (error) {
            console.error('שגיאה בשליחה:', error);
            alert('אירעה שגיאה בשליחה');
        }
    };

    const renderFieldSelect = (fieldName, otherFieldName) => (
        <>
            <Form.Group className="mb-3">
                <Form.Label>תחום</Form.Label>
                <Form.Select
                    name={fieldName}
                    value={formData[fieldName]}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled hidden>בחרי תחום</option>
                    {fields.map((field, i) => (
                        <option key={i} value={field}>{field}</option>
                    ))}
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

    return (
        <Container className="mt-5">
            <h2 className="mb-4 text-center">טופס הוספת תלמידה</h2>
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
                            <Form.Label>מספר זהות *</Form.Label>
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
                            <Form.Label>שכבת כיתה *</Form.Label>
                            <Form.Control
                                list="classOptions"
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                required
                                placeholder="לדוגמה: י'"
                            />
                            <datalist id="classOptions">
                                {Array.from(new Set(classOptions.map(c => c[0]))).map((cl, idx) => (
                                    <option key={idx} value={cl} />
                                ))}
                            </datalist>
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
