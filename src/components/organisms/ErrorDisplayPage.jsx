import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';

const ErrorDisplayPage = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <Heading as="h3" className="text-lg font-medium text-surface-900 mb-2">
          Failed to load data
        </Heading>
        <Paragraph className="text-surface-600 mb-4">{message}</Paragraph>
        <Button
          onClick={onRetry}
          className="bg-primary text-white hover:bg-primary/90"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorDisplayPage;