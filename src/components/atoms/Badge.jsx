import React from 'react';

const Badge = ({ children, className = '', ...props }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;