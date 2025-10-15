import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../config';

const StudentsFieldsTable = () => {
    const [students, setStudents] = useState([]);
    const [fields, setFields] = useState([]);
    const [message, setMessage] = useState({ text: '', variant: '' });
    const schoolId = localStorage.getItem('schoolId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentsRes = await axios.get(`${BASE_URL}students/${schoolId}`);
                const schoolRes = await axios.get(`${BASE_URL}schools/${schoolId}`);
                const schoolFields = JSON.parse(schoolRes.data[0]?.fields) || [];

                const formattedStudents = studentsRes.data.map(s => {
                    const studentFields = [s.field1, s.field2, s.field3, s.field4];
                    return {
                        ...s,
                        selectedFields: studentFields.map(f => schoolFields.includes(f) ? f : '-'),
                        otherFields: studentFields.map(f => schoolFields.includes(f) ? '' : f)
                    };
                });

                setFields(schoolFields);
                setStudents(formattedStudents);
            } catch (err) {
                console.error('שגיאה בטעינת תלמידות או תחומים:', err);
            }
        };
        fetchData();
    }, [schoolId]);

    const handleFieldChange = (studentIndex, fieldIndex, value, isOther) => {
        console.log("handleFieldChange called with:", { studentIndex, fieldIndex, value, isOther });
        
        setStudents(prev => {
            const updated = [...prev];
            const student = { ...updated[studentIndex] };

            // ספירת התחומים שנבחרו כרגע
            const allSelected = [
                ...student.selectedFields.filter(f => f && f !== ''),
                ...student.otherFields.filter(f => f && f !== '')
            ];
            console.log("all selected.length: ", allSelected.length );

            // אם מנסים להוסיף תחום חדש מעבר ל-4
            const isNewSelection = isOther
                ? value && !student.otherFields[fieldIndex]
                : value && !student.selectedFields.includes(value);
            
            if (isNewSelection && allSelected.length >= 4) {
                setMessage({ text: `תלמידה ${student.firstname} יכולה לבחור עד 4 תחומים בלבד`, variant: 'danger' });
                return prev; // לא לשנות
            }

            // עדכון רגיל
            if (isOther) {
                student.otherFields[fieldIndex] = value;
                if (value) student.selectedFields[fieldIndex] = '-';
            } else {
                student.selectedFields[fieldIndex] = value;
                if (value !== '-') student.otherFields[fieldIndex] = '';
            }

            updated[studentIndex] = student;
            return updated;
        });
    };

    const handleSave = async (student) => {
        const fieldsToSend = student.selectedFields.map((f, i) =>
            f === '-' ? student.otherFields[i] : f
        );
        try {
            await axios.put(`${BASE_URL}students/schoolid/${student.id}`, {
                schoolId: Number(schoolId),
                field1: fieldsToSend[0] || '',
                field2: fieldsToSend[1] || '',
                field3: fieldsToSend[2] || '',
                field4: fieldsToSend[3] || ''
            });
            setMessage({ text: `שמור בהצלחה לתלמידה ${student.firstname}`, variant: 'success' });
        } catch (err) {
            console.error('שגיאה בשמירה:', err);
            setMessage({ text: `שגיאה בשמירה לתלמידה ${student.firstname}`, variant: 'danger' });
        }
    };

    return (
        <div>
            {message.text && <Alert variant={message.variant}>{message.text}</Alert>}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ת"ז</th>
                        <th>שם פרטי</th>
                        <th>שם משפחה</th>
                        {fields.map((f, idx) => <th key={idx}>{f}</th>)}
                        {[...Array(4)].map((_, idx) => <th key={idx}>- {idx + 1}</th>)}
                        <th>פעולה</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, si) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.firstname}</td>
                            <td>{student.lastname}</td>

                            {fields.map((field, fi) => (
                                <td key={fi}>
                                    <Form.Check
                                        type="checkbox"
                                        checked={student.selectedFields.includes(field)}
                                        onChange={() => handleFieldChange(si, fi, field, false)}
                                    />
                                </td>
                            ))}

                            {[0, 1, 2, 3].map((oi) => (
                                <td key={oi} style={{ minWidth: '150px' }}>
                                    <Form.Control
                                        type="text"
                                        value={student.otherFields[oi] || ''}
                                        onChange={e => handleFieldChange(si, oi, e.target.value, true)}
                                        placeholder="-"
                                    />
                                </td>
                            ))}

                            <td>
                                <Button onClick={() => handleSave(student)}>שמור</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default StudentsFieldsTable;
