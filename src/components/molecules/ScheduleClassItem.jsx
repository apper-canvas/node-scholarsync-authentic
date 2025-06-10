import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Paragraph from '@/components/atoms/Paragraph';

const ScheduleClassItem = ({ classItem, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
      className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-primary font-medium text-sm">
            {classItem.period}
          </span>
        </div>
        <div>
          <p className="font-medium text-surface-900">{classItem.name}</p>
          <Paragraph className="text-sm text-surface-500">Room {classItem.room}</Paragraph>
        </div>
      </div>
      <Badge className="bg-secondary/10 text-secondary">
        {classItem.subject}
      </Badge>
    </motion.div>
  );
};

export default ScheduleClassItem;