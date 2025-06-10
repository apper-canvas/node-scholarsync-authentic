import React from 'react';
import Card from '@/components/atoms/Card';
import Paragraph from '@/components/atoms/Paragraph';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, delay }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <Paragraph className="text-sm font-medium text-surface-600 mb-1">{title}</Paragraph>
          <p className="text-2xl font-bold text-surface-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <ApperIcon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;