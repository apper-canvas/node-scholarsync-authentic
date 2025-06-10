import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';

const ClassCard = ({ classObj, index, studentsCount, getSubjectColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
      className="bg-surface-50 rounded-lg p-4 border border-surface-200 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-sm">
              {classObj.period}
            </span>
          </div>
          <Badge className={getSubjectColor(classObj.subject)}>
            {classObj.subject}
          </Badge>
        </div>
        <ApperIcon name="MapPin" className="w-4 h-4 text-surface-500" />
      </div>

      <Heading as="h3" className="font-medium text-surface-900 mb-1">
        {classObj.name}
      </Heading>
      <Paragraph className="text-sm text-surface-600 mb-3">
        Room {classObj.room}
      </Paragraph>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Users" className="w-4 h-4 text-surface-500" />
          <Paragraph className="text-sm text-surface-600">
            {studentsCount} students
          </Paragraph>
        </div>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-primary hover:bg-primary/10 p-1 rounded transition-colors duration-200"
        >
          <ApperIcon name="ArrowRight" className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default ClassCard;