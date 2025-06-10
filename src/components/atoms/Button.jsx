import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, type = 'button', ...motionProps }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${className}`}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;