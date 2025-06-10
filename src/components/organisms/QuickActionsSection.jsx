import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';
import { useNavigate } from 'react-router-dom';

const QuickActionsSection = ({ motionDelay }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: motionDelay }}
      className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white"
    >
      <div className="flex items-center justify-between">
        <div>
          <Heading as="h3" className="text-lg font-semibold mb-2 text-white">
            Complete Your Daily Tasks
          </Heading>
          <Paragraph className="text-white/90 mb-4">
            Mark attendance, enter grades, and check announcements to stay on top of your school management.
          </Paragraph>
          <div className="flex space-x-3">
            <Button
              onClick={() => navigate('/attendance')}
              className="bg-white text-primary hover:bg-surface-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mark Attendance
            </Button>
            <Button
              onClick={() => navigate('/grades')}
              className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enter Grades
            </Button>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
            <ApperIcon name="CheckCircle" className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActionsSection;