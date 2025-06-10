import React from 'react';
import { motion } from 'framer-motion';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const PageHeader = ({ title, description, actionButton, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <Heading as="h1" className="text-3xl font-bold text-surface-900 mb-2">
          {title}
        </Heading>
        <Paragraph className="text-surface-600">
          {description}
        </Paragraph>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {children} {/* For additional controls like date picker, select */}
        {actionButton && (
          <Button
            onClick={actionButton.onClick}
            disabled={actionButton.disabled}
            className={`bg-primary text-white hover:bg-primary/90 flex items-center space-x-2 ${actionButton.className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {actionButton.icon && <ApperIcon name={actionButton.icon} className="w-4 h-4" />}
            <span>{actionButton.label}</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default PageHeader;