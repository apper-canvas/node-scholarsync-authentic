import React from 'react';

const Paragraph = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-surface-600 ${className}`} {...props}>
      {children}
    </p>
  );
};

export default Paragraph;