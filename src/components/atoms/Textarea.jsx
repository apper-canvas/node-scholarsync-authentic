import React from 'react';
import { motion } from 'framer-motion';

const Textarea = ({ children, className = '', value, onChange, placeholder, rows = 3, ...props }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${className}`}
      {...props}
    >
      {children}
    </textarea>
  );
};

export default Textarea;