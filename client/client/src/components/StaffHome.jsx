import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const StaffHome = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem('staffName');
  return (
    <Container className="mt-5 text-center">
      <h2>שלום ל{name}</h2>
      <Button variant="primary" className="m-3" onClick={() => navigate('/classes')}>
        מילוי פרטים - הצגת כיתות
      </Button>
      <Button variant="secondary" className="m-3" onClick={() => navigate('/data-fetch')}>
        שליפת נתונים
      </Button>
    </Container>
  );
};

export default StaffHome;
