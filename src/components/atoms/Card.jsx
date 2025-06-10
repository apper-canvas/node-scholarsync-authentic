import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', initial, animate, transition, ...props }) => {
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-sm border border-surface-200 ${className}`}
      initial={initial}
      animate={animate}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;