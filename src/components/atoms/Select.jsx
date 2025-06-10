import React from 'react';
import { motion } from 'framer-motion';

const Select = ({ children, className = '', value, onChange, ...props }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;