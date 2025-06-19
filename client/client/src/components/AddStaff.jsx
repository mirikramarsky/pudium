import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStaff = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ id: '', name: '', confirm: 3, class: "all" });
    const [message, setMessage] = useState(null);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const schoolId = localStorage.getItem('schoolId');

        try {
            await axios.post('https://pudium-production.up.railway.app/api/podium/staff', {
                ...formData,
                schoolId: Number(schoolId)
            });
            setMessage('נוספה בהצלחה');
            navigate('/staff-home')
        } catch (err) {
            setMessage('שגיאה בהוספה');
        }
    };

    return (
        <Container className="mt-4">
            <h3>הוספת אשת צוות</h3>
            {message && <Alert>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>שם</Form.Label>
                    <Form.Control name="name" value={formData.name} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>קוד</Form.Label>
                    <Form.Control name="id" value={formData.id} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>הרשאת גישה</Form.Label>
                    <Form.Select
                        name="confirm"
                        value={formData.confirm}
                        onChange={handleChange}
                        required
                    >
                        <option value="">בחר הרשאה</option>
                        <option value="0">0 - מנהלת מערכת</option>
                        <option value="1">1 - גישה לכל התלמידות</option>
                        <option value="2">2 - למחנכת (יש להזין כיתת חינוך)</option>
                        <option value="3">3 - עובדת כללית (אין גישה לפרטי התלמידות ועריכתן)</option>
                    </Form.Select>
                </Form.Group>

                {formData.confirm === '2' && (
                    <Form.Group className="mb-3">
                        <Form.Label>כיתת חינוך</Form.Label>
                        <Form.Control
                            name="class"
                            type="text"
                            placeholder="כיתה"
                            //    value={formData.class}
                            onChange={handleChange}
                            required={formData.confirm === '2'}
                        />
                    </Form.Group>
                )}


                <Button className="mt-3" type="submit">שמור</Button>
            </Form>
        </Container>
    );
};

export default AddStaff;
