// import React, { useEffect, useState } from 'react';
// import { Table, Form, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import BASE_URL from '../config';

// const StudentsFieldsTable = () => {
//     const [students, setStudents] = useState([]);
//     const [fields, setFields] = useState([]);
//     const [message, setMessage] = useState({ text: '', variant: '' });
//     const schoolId = localStorage.getItem('schoolId');

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const studentsRes = await axios.get(`${BASE_URL}students/${schoolId}`);
//                 const schoolRes = await axios.get(`${BASE_URL}schools/${schoolId}`);
//                 const schoolFields = JSON.parse(schoolRes.data[0]?.fields) || [];

//                 const formattedStudents = studentsRes.data.map(s => {
//                     const studentFields = [s.field1, s.field2, s.field3, s.field4];
//                     return {
//                         ...s,
//                         selectedFields: studentFields.map(f => schoolFields.includes(f) ? f : '-'),
//                         otherFields: studentFields.map(f => schoolFields.includes(f) ? '' : f)
//                     };
//                 });

//                 setFields(schoolFields);
//                 setStudents(formattedStudents);
//             } catch (err) {
//                 console.error('שגיאה בטעינת תלמידות או תחומים:', err);
//             }
//         };
//         fetchData();
//     }, [schoolId]);

//     const saveStudent = async (student) => {
//         const fieldsToSend = student.selectedFields.map((f, i) =>
//             f === '-' ? student.otherFields[i] : f
//         );
//         try {
//             await axios.put(`${BASE_URL}students/${student.id}`, {
//                 schoolId: Number(schoolId),
//                 field1: fieldsToSend[0] || '',
//                 field2: fieldsToSend[1] || '',
//                 field3: fieldsToSend[2] || '',
//                 field4: fieldsToSend[3] || ''
//             });
//             setMessage({ text: `שמור בהצלחה לתלמידה ${student.firstname} ${student.lastname}`, variant: 'success' });
//         } catch (err) {
//             console.error('שגיאה בשמירה:', err);
//             setMessage({ text: `שגיאה בשמירה לתלמידה ${student.firstname} ${student.lastname}`, variant: 'danger' });
//         }
//     };

//     // const handleFieldChange = (studentIndex, fieldIndex, value, isOther) => {
//     //     setStudents(prev => {
//     //         const updated = [...prev];
//     //         const student = { ...updated[studentIndex] };

//     //         const allSelected = [
//     //             ...student.selectedFields.filter(f => f && f !== '' && f !== '-'),
//     //             ...student.otherFields.filter(f => f && f !== '' && f !== '-')
//     //         ];

//     //         const isNewSelection = isOther
//     //             ? value && !student.otherFields[fieldIndex]
//     //             : value && !student.selectedFields.includes(value);

//     //         if (isNewSelection && allSelected.length >= 4) {
//     //             setMessage({ text: `כל תלמידה יכולה לבחור עד 4 תחומים בלבד`, variant: 'danger' });
//     //             return prev; 
//     //         }

//     //         if (isOther) {
//     //             student.otherFields[fieldIndex] = value;
//     //             if (value) student.selectedFields[fieldIndex] = '-';
//     //         } else {
//     //             // ביטול אם התחום כבר נבחר
//     //             if (student.selectedFields.includes(value)) {
//     //                 student.selectedFields[fieldIndex] = '-';
//     //             } else {
//     //                 student.selectedFields[fieldIndex] = value;
//     //                 if (value !== '-') student.otherFields[fieldIndex] = '';
//     //             }
//     //         }

//     //         updated[studentIndex] = student;
//     //         return updated;
//     //     });

//     //     // שמירה אוטומטית לצ'קבוקס
//     //     if (!isOther) {
//     //         saveStudent(students[studentIndex]);
//     //     }
//     // };
   
//     return (
//         <div>
//             {message.text && <Alert variant={message.variant}>{message.text}</Alert>}
//             <Table striped bordered hover responsive>
//                 <thead>
//                     <tr>
//                         <th>ת"ז</th>
//                         <th>שם פרטי</th>
//                         <th>שם משפחה</th>
//                         {fields.map((f, idx) => <th key={idx}>{f}</th>)}
//                         {[...Array(4)].map((_, idx) => <th key={idx}>אחר {idx + 1}</th>)}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {students.map((student, si) => (
//                         <tr key={student.id}>
//                             <td>{student.id}</td>
//                             <td>{student.firstname}</td>
//                             <td>{student.lastname}</td>

//                             {fields.map((field, fi) => (
//                                 <td key={fi}>
//                                     <Form.Check
//                                         type="checkbox"
//                                         checked={student.selectedFields.includes(field)}
//                                         onChange={() => handleFieldChange(si, fi, field, false)}
//                                     />
//                                 </td>
//                             ))}

//                             {[0, 1, 2, 3].map((oi) => (
//                                 <td key={oi} style={{ minWidth: '150px' }}>
//                                     <Form.Control
//                                         type="text"
//                                         value={student.otherFields[oi] || ''}
//                                         onChange={e => {
//                                             const val = e.target.value;
//                                             setStudents(prev => {
//                                                 const updated = [...prev];
//                                                 updated[si].otherFields[oi] = val;
//                                                 if (val) updated[si].selectedFields[oi] = '-';
//                                                 return updated;
//                                             });
//                                         }}
//                                         onBlur={() => saveStudent(students[si])}
//                                         placeholder="-"
//                                     />
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </div>
//     );
// };

// export default StudentsFieldsTable;















// import React, { useEffect, useState } from 'react';
// import { Table, Form, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import BASE_URL from '../config';

// const StudentsFieldsTable = () => {
//     const [students, setStudents] = useState([]);
//     const [fields, setFields] = useState([]);
//     const [message, setMessage] = useState({ text: '', variant: '' });
//     const schoolId = localStorage.getItem('schoolId');

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const studentsRes = await axios.get(`${BASE_URL}students/${schoolId}`);
//                 const schoolRes = await axios.get(`${BASE_URL}schools/${schoolId}`);
//                 const schoolFields = JSON.parse(schoolRes.data[0]?.fields) || [];

//                 const formattedStudents = studentsRes.data.map(s => {
//                     const studentFields = [s.field1, s.field2, s.field3, s.field4];
//                     return {
//                         ...s,
//                         selectedFields: studentFields.map(f => schoolFields.includes(f) ? f : ''),
//                         otherFields: studentFields.map(f => schoolFields.includes(f) ? '' : f)
//                     };
//                 });

//                 setFields(schoolFields);
//                 setStudents(formattedStudents);
//             } catch (err) {
//                 console.error('שגיאה בטעינת תלמידות או תחומים:', err);
//             }
//         };
//         fetchData();
//     }, [schoolId]);

//     const saveStudent = async (student) => {
//         const fieldsToSend = student.selectedFields.map((f, i) =>
//             f === '' ? student.otherFields[i] : f
//         );
//         try {
//             await axios.put(`${BASE_URL}students/${student.id}`, {
//                 schoolId: Number(schoolId),
//                 field1: fieldsToSend[0] || '',
//                 field2: fieldsToSend[1] || '',
//                 field3: fieldsToSend[2] || '',
//                 field4: fieldsToSend[3] || ''
//             });
//             setMessage({ text: `שמור בהצלחה לתלמידה ${student.firstname} ${student.lastname}`, variant: 'success' });
//         } catch (err) {
//             console.error('שגיאה בשמירה:', err);
//             setMessage({ text: `שגיאה בשמירה לתלמידה ${student.firstname} ${student.lastname}`, variant: 'danger' });
//         }
//     };

//     const handleCheckboxChange = (studentIndex, fieldName) => {
//         setStudents(prev => {
//             const updated = [...prev];
//             const student = { ...updated[studentIndex] };

//             // אם התחום כבר מסומן – נבטל אותו
//             if (student.selectedFields.includes(fieldName)) {
//                 const idx = student.selectedFields.indexOf(fieldName);
//                 student.selectedFields[idx] = '';
//             } else {
//                 // נמצא את השדה הריק הראשון ונמלא אותו
//                 const emptyIndex = student.selectedFields.findIndex(f => f === '');
//                 if (emptyIndex !== -1) {
//                     student.selectedFields[emptyIndex] = fieldName;
//                 } else {
//                     setMessage({ text: `לא ניתן לבחור יותר מ-4 תחומים`, variant: 'danger' });
//                     return prev;
//                 }
//             }

//             updated[studentIndex] = student;
//             saveStudent(student);
//             return updated;
//         });
//     };

//     const handleOtherChange = (studentIndex, otherIndex, value) => {
//         setStudents(prev => {
//             const updated = [...prev];
//             updated[studentIndex].otherFields[otherIndex] = value;
//             updated[studentIndex].selectedFields[otherIndex] = value ? '-' : '';
//             return updated;
//         });
//     };

//     const handleOtherBlur = (studentIndex) => {
//         saveStudent(students[studentIndex]);
//     };

//     return (
//         <div>
//             {message.text && <Alert variant={message.variant}>{message.text}</Alert>}
//             <Table striped bordered hover responsive>
//                 <thead>
//                     <tr>
//                         <th>ת"ז</th>
//                         <th>שם פרטי</th>
//                         <th>שם משפחה</th>
//                         {fields.map((f, idx) => <th key={idx}>{f}</th>)}
//                         {[0, 1, 2, 3].map((_, idx) => <th key={idx}>אחר {idx + 1}</th>)}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {students.map((student, si) => (
//                         <tr key={student.id}>
//                             <td>{student.id}</td>
//                             <td>{student.firstname}</td>
//                             <td>{student.lastname}</td>

//                             {fields.map((field, fi) => (
//                                 <td key={fi}>
//                                     <Form.Check
//                                         type="checkbox"
//                                         checked={student.selectedFields.includes(field)}
//                                         onChange={() => handleCheckboxChange(si, field)}
//                                     />
//                                 </td>
//                             ))}

//                             {[0, 1, 2, 3].map((oi) => (
//                                 <td key={oi} style={{ minWidth: '150px' }}>
//                                     <Form.Control
//                                         type="text"
//                                         value={student.otherFields[oi] || ''}
//                                         onChange={e => handleOtherChange(si, oi, e.target.value)}
//                                         onBlur={() => handleOtherBlur(si)}
//                                         placeholder="-"
//                                     />
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </div>
//     );
// };

// export default StudentsFieldsTable;












// import React, { useEffect, useState } from 'react';
// import { Table, Form, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import BASE_URL from '../config';

// const StudentsFieldsTable = () => {
//     const [students, setStudents] = useState([]);
//     const [fields, setFields] = useState([]);
//     const [message, setMessage] = useState({ text: '', variant: '' });
//     const schoolId = localStorage.getItem('schoolId');

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const studentsRes = await axios.get(`${BASE_URL}students/${schoolId}`);
//                 const schoolRes = await axios.get(`${BASE_URL}schools/${schoolId}`);
//                 const schoolFields = JSON.parse(schoolRes.data[0]?.fields) || [];

//                 const formattedStudents = studentsRes.data.map(s => {
//                     const studentFields = [s.field1, s.field2, s.field3, s.field4];
//                     return {
//                         ...s,
//                         selectedFields: studentFields.map(f => schoolFields.includes(f) ? f : ''),
//                         otherFields: studentFields.map(f => schoolFields.includes(f) ? '' : f)
//                     };
//                 });

//                 setFields(schoolFields);
//                 setStudents(formattedStudents);
//             } catch (err) {
//                 console.error('שגיאה בטעינת תלמידות או תחומים:', err);
//             }
//         };
//         fetchData();
//     }, [schoolId]);

//     const saveStudent = async (student) => {
//         // בונה את השדות בדיוק כפי שהם, כולל כל "אחר"
//         const fieldsToSend = student.selectedFields.map((f, i) =>
//             f !== '' ? f : student.otherFields[i] || ''
//         );

//         try {
//             await axios.put(`${BASE_URL}students/${student.id}`, {
//                 schoolId: Number(schoolId),
//                 field1: fieldsToSend[0] || '',
//                 field2: fieldsToSend[1] || '',
//                 field3: fieldsToSend[2] || '',
//                 field4: fieldsToSend[3] || ''
//             });
//             setMessage({ text: `שמור בהצלחה לתלמידה ${student.firstname} ${student.lastname}`, variant: 'success' });
//         } catch (err) {
//             console.error('שגיאה בשמירה:', err);
//             setMessage({ text: `שגיאה בשמירה לתלמידה ${student.firstname} ${student.lastname}`, variant: 'danger' });
//         }
//     };

//     const handleCheckboxChange = (studentIndex, fieldName) => {
//         setStudents(prev => {
//             const updated = [...prev];
//             const student = { ...updated[studentIndex] };

//             if (student.selectedFields.includes(fieldName)) {
//                 const idx = student.selectedFields.indexOf(fieldName);
//                 student.selectedFields[idx] = '';
//             } else {
//                 const emptyIndex = student.selectedFields.findIndex(f => f === '');
//                 if (emptyIndex !== -1) {
//                     student.selectedFields[emptyIndex] = fieldName;
//                 } else {
//                     setMessage({ text: `לא ניתן לבחור יותר מ-4 תחומים`, variant: 'danger' });
//                     return prev;
//                 }
//             }

//             updated[studentIndex] = student;
//             saveStudent(student);
//             return updated;
//         });
//     };

//     const handleOtherChange = (studentIndex, otherIndex, value) => {
//         setStudents(prev => {
//             const updated = [...prev];
//             updated[studentIndex].otherFields[otherIndex] = value; // שומר את הכל בדיוק כפי שהוא
//             return updated;
//         });
//     };

//     const handleOtherBlur = (studentIndex) => {
//         saveStudent(students[studentIndex]);
//     };

//     return (
//         <div>
//             {message.text && <Alert variant={message.variant}>{message.text}</Alert>}
//             <Table striped bordered hover responsive>
//                 <thead>
//                     <tr>
//                         <th>ת"ז</th>
//                         <th>שם פרטי</th>
//                         <th>שם משפחה</th>
//                         {fields.map((f, idx) => <th key={idx}>{f}</th>)}
//                         {[0, 1, 2, 3].map((_, idx) => <th key={idx}>אחר {idx + 1}</th>)}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {students.map((student, si) => (
//                         <tr key={student.id}>
//                             <td>{student.id}</td>
//                             <td>{student.firstname}</td>
//                             <td>{student.lastname}</td>

//                             {fields.map((field, fi) => (
//                                 <td key={fi}>
//                                     <Form.Check
//                                         type="checkbox"
//                                         checked={student.selectedFields.includes(field)}
//                                         onChange={() => handleCheckboxChange(si, field)}
//                                     />
//                                 </td>
//                             ))}

//                             {[0, 1, 2, 3].map((oi) => (
//                                 <td key={oi} style={{ minWidth: '150px' }}>
//                                     <Form.Control
//                                         type="text"
//                                         value={student.otherFields[oi] || ''}
//                                         onChange={e => handleOtherChange(si, oi, e.target.value)}
//                                         onBlur={() => handleOtherBlur(si)}
//                                         placeholder="-"
//                                     />
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </div>
//     );
// };

// export default StudentsFieldsTable;






import React, { useEffect, useState } from 'react';
import { Table, Form, Alert } from 'react-bootstrap';
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
                    const selected = studentFields.filter(f => schoolFields.includes(f));
                    const others = studentFields.filter(f => !schoolFields.includes(f));

                    return {
                        ...s,
                        selectedFields: selected.concat(Array(4 - selected.length).fill('')).slice(0, 4),
                        otherFields: others.concat(Array(4 - others.length).fill('')).slice(0, 4)
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

    const saveStudent = async (student) => {
        const fieldsToSend = student.selectedFields.map((f, i) =>
            f !== '' ? f : (student.otherFields[i] || '')
        );

        try {
            await axios.put(`${BASE_URL}students/${student.id}`, {
                schoolId: Number(schoolId),
                field1: fieldsToSend[0] || '',
                field2: fieldsToSend[1] || '',
                field3: fieldsToSend[2] || '',
                field4: fieldsToSend[3] || ''
            });
            setMessage({ text: `נשמר בהצלחה לתלמידה ${student.firstname} ${student.lastname}`, variant: 'success' });
        } catch (err) {
            console.error('שגיאה בשמירה:', err);
            setMessage({ text: `שגיאה בשמירה לתלמידה ${student.firstname} ${student.lastname}`, variant: 'danger' });
        }
    };

    const countValidFields = (student) => {
        return [...student.selectedFields, ...student.otherFields].filter(f => f && f.trim() !== '').length;
    };

    const handleCheckboxChange = (studentIndex, fieldName) => {
        setStudents(prev => {
            const updated = [...prev];
            const student = { ...updated[studentIndex] };
            const totalSelected = countValidFields(student);

            if (student.selectedFields.includes(fieldName)) {
                const idx = student.selectedFields.indexOf(fieldName);
                student.selectedFields[idx] = '';
            } else {
                if (totalSelected >= 4) {
                    setMessage({ text: 'לא ניתן לבחור יותר מ-4 תחומים (כולל אחרים)', variant: 'danger' });
                    return prev;
                }
                const emptyIndex = student.selectedFields.findIndex(f => f === '');
                if (emptyIndex !== -1) {
                    student.selectedFields[emptyIndex] = fieldName;
                }
            }

            updated[studentIndex] = student;
            saveStudent(student);
            return updated;
        });
    };

    const handleOtherChange = (studentIndex, otherIndex, value) => {
        setStudents(prev => {
            const updated = [...prev];
            updated[studentIndex].otherFields[otherIndex] = value;
            return updated;
        });
    };

    const handleOtherBlur = (studentIndex) => {
        const student = students[studentIndex];
        const totalSelected = countValidFields(student);
        if (totalSelected > 4) {
            setMessage({ text: 'לא ניתן לבחור יותר מ-4 תחומים (כולל אחרים)', variant: 'danger' });
            return;
        }
        saveStudent(student);
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
                        {[0, 1, 2, 3].map((_, idx) => <th key={idx}>אחר {idx + 1}</th>)}
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
                                        onChange={() => handleCheckboxChange(si, field)}
                                    />
                                </td>
                            ))}

                            {[0, 1, 2, 3].map((oi) => (
                                <td key={oi} style={{ minWidth: '150px' }}>
                                    <Form.Control
                                        type="text"
                                        value={student.otherFields[oi] || ''}
                                        onChange={e => handleOtherChange(si, oi, e.target.value)}
                                        onBlur={() => handleOtherBlur(si)}
                                        placeholder="-"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default StudentsFieldsTable;
