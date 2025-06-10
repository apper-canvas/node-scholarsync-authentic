import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';

const EmptyStateDisplay = ({ icon, title, description, actionButton, animateIcon = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 bg-white rounded-lg shadow-sm border border-surface-200"
    >
      {icon && (
        <motion.div
          animate={animateIcon ? { y: [0, -10, 0] } : {}}
          transition={animateIcon ? { repeat: Infinity, duration: 3 } : {}}
        >
          <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto" />
        </motion.div>
      )}
      <Heading as="h3" className="mt-4 text-lg font-medium text-surface-900">{title}</Heading>
      <Paragraph className="mt-2 text-surface-500">{description}</Paragraph>
      {actionButton && (
        <Button
          onClick={actionButton.onClick}
          className="mt-4 bg-primary text-white hover:bg-primary/90"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {actionButton.label}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyStateDisplay;