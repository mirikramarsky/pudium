import React, { useEffect, useRef, useState } from 'react';
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
        schoolId: '',
        otherField1: '',
        otherField2: '',
        otherField3: '',
        otherField4: '',
    });

    const [fields, setFields] = useState([]);
    const inputRef = useRef(null); // יצירת ref לשדה הקלט

    useEffect(() => {
        inputRef.current?.focus(); // קביעת פוקוס אוטומטי כשנטען
    }, []);
    useEffect(() => {
        const fetchFields = async () => {
            const schoolId = localStorage.getItem('schoolId');
            if (!schoolId) return;

            try {
                const response = await axios.get(`${BASE_URL}schools/${schoolId}`);
                const schoolFields = JSON.parse(response.data[0]?.fields);

                if (!schoolFields || schoolFields.length === 0) {
                    throw new Error("לא נמצאו תחומים לבית הספר הזה");
                }

                setFields(schoolFields);
            } catch (err) {
                console.error("שגיאה בטעינת התחומים :", err);
                alert("שגיאה בטעינת הנתונים. נסי לרענן את הדף או לבדוק את החיבור לשרת.");
            }
        };

        fetchFields();
    }, []);


    // const handleChange = (e) => {
    //     const { name, value } = e.target;

    //     // בדיקה אם מדובר בשדה תחום
    //     if (name.startsWith("field")) {
    //         const selectedValues = Object.entries(formData)
    //             .filter(([key]) => key.startsWith("field") && key !== name)
    //             .map(([_, val]) => val);

    //         if (selectedValues.includes(value)) {
    //             alert("אין אפשרות לבחור את אותו תחום פעמיים");
    //             return;
    //         }
    //     }

    //     setFormData(prev => ({ ...prev, [name]: value }));
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;

        // מערך התחומים שכבר נבחרו בפועל (בלי השדה שאת משנה עכשיו)
        const selectedValues = [];

        for (let i = 1; i <= 4; i++) {
            const fieldKey = `field${i}`;
            const otherKey = `otherField${i}`;

            // מדלגים על השדה שאת בדיוק משנה עכשיו
            if (name === fieldKey || name === otherKey) continue;

            const fieldVal = formData[fieldKey];
            const otherVal = formData[otherKey];

            if (fieldVal === 'אחר' && otherVal) {
                selectedValues.push(otherVal.trim());
            } else if (fieldVal && fieldVal !== 'אחר') {
                selectedValues.push(fieldVal);
            }
        }

        // בודקים אם יש כפילות
        if (name.startsWith('field') && !name.startsWith('other')) {
            if (value && value !== 'אחר' && selectedValues.includes(value)) {
                alert("אין אפשרות לבחור את אותו תחום פעמיים");
                return;
            }
        }
        if (name.startsWith('otherField')) {
            if (value.trim() && selectedValues.includes(value.trim())) {
                alert("התחום הזה כבר נבחר באחד השדות");
                return;
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData
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
                ...submissionData
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
    useEffect(() => {
        const handleEnterKey = (e) => {
            // אם המשתמש לא בשדה select או textarea
            const tag = document.activeElement.tagName;
            if (e.key === 'Enter' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
                e.preventDefault();
                handleSubmit(e);
            }
        };

        window.addEventListener('keydown', handleEnterKey);
        return () => window.removeEventListener('keydown', handleEnterKey);
    }, [formData]); // מאזין לשינויים בטופס

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
    const handleIdBlur = async () => {
        console.log('Handling ID blur:', formData.id);

        const schoolId = localStorage.getItem('schoolId');
        if (!formData.id || !schoolId) return;

        try {
            const response = await axios.post(`${BASE_URL}students/schoolid/${formData.id}`, {
                schoolId
            });
            console.log("Response data:", response.data);

            if (response.data && response.data.length > 0) {
                const student = response.data[0];
                const { firstname, lastname, class: className, grade } = student;

                setFormData(prev => ({
                    ...prev,
                    firstname,
                    lastname,
                    class: className,
                    grade,
                    schoolId: schoolId
                }));

                setMessage({ text: '', variant: '' }); // מנקה הודעות קודמות
            } else {
                setMessage({
                    text: '⚠️ לא נמצאה תלמידה עם מספר זהות זה במוסד שלך',
                    variant: 'danger'
                });
                setFormData(prev => ({
                    ...prev,
                    firstname: '',
                    lastname: '',
                    class: '',
                    grade: ''
                }));
            }

        } catch (err) {
            console.error('שגיאה בשליפת התלמידה:', err);
            setMessage({
                text: 'שגיאה בשליפת הנתונים. ודאי שהמספר נכון ונסי שוב.',
                variant: 'danger'
            });
        }
    };


    return (
        <Container className="mt-5">
            <div className="position-relative text-center mb-4">
                <Button
                    variant="outline-secondary"
                    className="position-absolute"
                    style={{ right: 0 }}
                    onClick={() => navigate('../staff-login')}
                >
                    חזרה לדף ההתחברות 👉
                </Button>
                <h2 className="mb-0">טופס הוספת תלמידה</h2>
            </div>

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>מספר זהות *</Form.Label>
                            <Form.Control
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                onBlur={handleIdBlur} // בעת עזיבת השדה, נשלוף את הנתונים
                                required
                            />
                        </Form.Group>

                        {formData.firstname && (
                            <Alert variant="info" className="text-center">
                               ל שלום {formData.firstname} {formData.lastname} מכיתה {formData.class}-{formData.grade}
                            </Alert>
                        )}

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
