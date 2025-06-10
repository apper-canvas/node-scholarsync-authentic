import React from 'react';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const QuickActionCard = ({ title, description, icon, color, action, delay }) => {
  return (
    <Button
      onClick={action}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 text-left hover:shadow-md transition-all duration-200 flex flex-col items-start"
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color}`}>
        <ApperIcon name={icon} className="w-6 h-6" />
      </div>
      <Heading as="h3" className="font-medium text-surface-900 mb-2">{title}</Heading>
      <Paragraph className="text-sm text-surface-600">{description}</Paragraph>
    </Button>
  );
};

// Re-export Button if it's imported here (it's not but generally good practice for molecules that wrap atoms)
import Button from '@/components/atoms/Button';
export default QuickActionCard;