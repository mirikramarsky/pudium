import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const StudentForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    id: '',
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

  const fields = ['ריקוד', 'שירה', 'אימון מחול', 'מחול', 'עריכה', 'תפאורה', 'אחר'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const schoolId = localStorage.getItem('schoolId');

//     try {
//         console.log(formData);
//       await axios.post('https://pudium-production.up.railway.app/api/podium/students/', {
//         ...formData,
//         schoolId
//       });
//       alert('נשמר בהצלחה');
//     } catch (error) {
//       console.error('שגיאה בשליחה:', error);
//       alert('אירעה שגיאה בשליחה');
//     }
//   };

const handleSubmit = async (e) => {
  e.preventDefault();
//   const schoolId = localStorage.getItem('schoolId');
const schoolId = 55;
 setFormData(prev => ({ ...prev, ['schoolId']: schoolId }));
  // מעתיקים את הנתונים
  const submissionData = { ...formData };

  // מחליפים כל "אחר" בטקסט שהוזן
  for (let i = 1; i <= 4; i++) {
    const fieldKey = `field${i}`;
    const otherKey = `otherField${i}`;
    if (submissionData[fieldKey] === 'אחר' && submissionData[otherKey]) {
      submissionData[fieldKey] = submissionData[otherKey]; // שמים את הטקסט
    }
    delete submissionData[otherKey]; // מוחקים את שדות otherField
  }

  try {
    console.log(submissionData);
    await axios.post('https://pudium-production.up.railway.app/api/podium/students/', {
      ...submissionData,
      schoolId,
    });
    alert('נשמר בהצלחה');
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
            {/* <option value="" disabled hidden>בחרי תחום</option> */}
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
                name="firstName"
                value={formData.firstName}
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
                name="lastName"
                value={formData.lastName}
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
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>כיתה *</Form.Label>
              <Form.Control
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
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
          <Button variant="primary" type="submit">
            שלחי
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default StudentForm;
