import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import axios from 'axios';

const AddStaff = () => {
    const [formData, setFormData] = useState({ name: '', confirm: 0 });
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
                schoolid: Number(schoolId)
            });
            setMessage('נוספה בהצלחה');
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
                    <Form.Label>Confirm</Form.Label>
                    <Form.Control name="confirm" type="number" value={formData.confirm} onChange={handleChange} />
                </Form.Group>
                <Button className="mt-3" type="submit">שמור</Button>
            </Form>
        </Container>
    );
};

export default AddStaff;
