import React, { useEffect, useRef, useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';

const FieldsManagementPage = () => {
    const navigate = useNavigate();
    const schoolId = localStorage.getItem('schoolId');
    const [fields, setFields] = useState([]);
    const [newField, setNewField] = useState('');
    const [message, setMessage] = useState('');
    const inputRef = useRef(null); // יצירת ref לשדה הקלט

    useEffect(() => {
        inputRef.current?.focus(); // קביעת פוקוס אוטומטי כשנטען
    }, []);
    const handleAddField = () => {
        const trimmed = newField.trim();
        if (!trimmed) {
            setMessage('❗ אי אפשר להוסיף תחום ריק');
            return;
        }
        if (fields.includes(trimmed)) {
            setMessage('❗ התחום כבר קיים');
            return;
        }
        setFields([...fields, trimmed]);
        setNewField('');
        setMessage('');
    };
    const handleSave = async () => {
        try {
            await axios.put(`${BASE_URL}schools/${schoolId}`, {
                fields: JSON.stringify(fields.filter(f => f.trim() !== '')),
            });
            setMessage('✅ התחומים נשמרו בהצלחה!');
            navigate("/staff-manage")
        } catch (error) {
            console.error('שגיאה בשמירה:', error);
            setMessage('❌ שגיאה בשמירת התחומים');
        }

    };
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.tagName === 'INPUT') {
                    e.preventDefault(); // למנוע שליחת טופס רגילה

                    // אם הפוקוס בשדה "הוספת תחום"
                    if (activeElement.placeholder === 'הוספת תחום חדש') {
                        handleAddField();
                    }
                } else {
                    handleSave();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleAddField, handleSave]);


    useEffect(() => {
        const fetchFields = async () => {
            try {
                const response = await axios.get(`${BASE_URL}schools/${schoolId}`);
                const schoolFields = JSON.parse(response.data[0]?.fields) || [];
                setFields(schoolFields);
            } catch (error) {
                console.error('שגיאה בשליפת התחומים:', error);
            }
        };

        if (schoolId) fetchFields();
    }, [schoolId]);

    const handleFieldChange = (index, value) => {
        const updatedFields = [...fields];
        updatedFields[index] = value;
        setFields(updatedFields);
    };



    const handleDeleteField = (index) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        setFields(updatedFields);
    };

    const defaultFields = ["שירה", "מחול", "אימון שיר", "תפאורה", "כתיבת שיר", "עריכה", "הצגה", "אימון הצגה","ארגון","סיוע טכני", "הפקה"]; // רשימת ברירת מחדל של תחומים   

    const handleResetDefaults = () => {
        setFields([...defaultFields]);
    };
    return (
        <Container className="mt-5">
            <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
                <h3 className="mb-4 text-center">ניהול תחומים בבית הספר</h3>
                <Button
                    onClick={() => navigate('../staff-manage')}
                    variant="outline-secondary"
                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: '15%' }}
                >
                    חזרה 👉
                </Button>
            </div>
            {message && <Alert variant={message.startsWith('✅') ? 'success' : 'danger'}>{message}</Alert>}

            {fields.map((field, index) => (
                <Form.Group dir='rtl' as={Row} className="mb-2" key={index}>
                    <Form.Label column sm="2">תחום {index + 1}</Form.Label>
                    <Col sm="8">
                        <Form.Control
                            type="text"
                            value={field}
                            onChange={(e) => handleFieldChange(index, e.target.value)}
                        />
                    </Col>
                    <Col sm="2">
                        <Button variant="danger" onClick={() => handleDeleteField(index)}>מחק</Button>
                    </Col>
                </Form.Group>
            ))}

            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">הוספת תחום</Form.Label>
                <Col sm="8">
                    <Form.Control
                        type="text"
                        placeholder="הוספת תחום חדש"
                        value={newField}
                        onChange={(e) => setNewField(e.target.value)}
                        ref={inputRef}
                    />
                </Col>
                <Col sm="2">
                    <Button variant="primary" onClick={handleAddField}>➕ הוסף</Button>
                </Col>
            </Form.Group>

            <div className="text-center mt-4">
                <Button variant="info" onClick={handleResetDefaults}>
                    🔁 איפוס לברירת מחדל
                </Button>
                <Button variant="success" onClick={handleSave}>💾 שמור שינויים</Button>
            </div>
        </Container>
    );
};

export default FieldsManagementPage;
