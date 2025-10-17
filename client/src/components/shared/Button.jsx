// File: src/components/shared/Button.js
import React from 'react';

const Button = ({ onClick, children, type = 'button' }) => {
  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  };

  return (
    <button style={buttonStyle} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;