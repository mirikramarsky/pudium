import React, { useEffect, useRef } from 'react';
import { Alert } from 'react-bootstrap';

const ScrollToAlert = ({ variant = 'info', children }) => {
  const messageRef = useRef(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div ref={messageRef}>
      <Alert variant={variant}>{children}</Alert>
    </div>
  );
};

export default ScrollToAlert;
