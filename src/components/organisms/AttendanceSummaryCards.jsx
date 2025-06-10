import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import Paragraph from '@/components/atoms/Paragraph';

const AttendanceSummaryCards = ({ stats, motionDelay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: motionDelay }}
      className="grid grid-cols-2 md:grid-cols-5 gap-4"
    >
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Users" className="w-5 h-5 text-surface-500" />
          <div>
            <Paragraph className="text-sm text-surface-600">Total</Paragraph>
            <p className="text-xl font-bold text-surface-900">{stats.total}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
          <div>
            <Paragraph className="text-sm text-surface-600">Present</Paragraph>
            <p className="text-xl font-bold text-success">{stats.present}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="XCircle" className="w-5 h-5 text-error" />
          <div>
            <Paragraph className="text-sm text-surface-600">Absent</Paragraph>
            <p className="text-xl font-bold text-error">{stats.absent}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
          <div>
            <Paragraph className="text-sm text-surface-600">Late</Paragraph>
            <p className="text-xl font-bold text-warning">{stats.late}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Percent" className="w-5 h-5 text-primary" />
          <div>
            <Paragraph className="text-sm text-surface-600">Rate</Paragraph>
            <p className="text-xl font-bold text-primary">{stats.attendanceRate}%</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AttendanceSummaryCards;