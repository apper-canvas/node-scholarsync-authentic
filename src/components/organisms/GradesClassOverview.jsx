import React from 'react';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const GradesClassOverview = ({ selectedClass, classStudentsCount, assignmentsCount, totalGrades, classAverage, motionDelay }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: motionDelay }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <Heading as="h2" className="text-lg font-semibold text-surface-900">
            {selectedClass.name}
          </Heading>
          <Paragraph className="text-surface-600">
            {selectedClass.subject} • Period {selectedClass.period} • Room {selectedClass.room}
          </Paragraph>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{classAverage}</p>
          <Paragraph className="text-sm text-surface-500">Class Average</Paragraph>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Users" className="w-5 h-5 text-surface-500" />
            <div>
              <Paragraph className="text-sm text-surface-600">Total Students</Paragraph>
              <p className="text-xl font-bold text-surface-900">{classStudentsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="FileText" className="w-5 h-5 text-surface-500" />
            <div>
              <Paragraph className="text-sm text-surface-600">Total Assignments</Paragraph>
              <p className="text-xl font-bold text-surface-900">
                {assignmentsCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Award" className="w-5 h-5 text-surface-500" />
            <div>
              <Paragraph className="text-sm text-surface-600">Total Grades</Paragraph>
              <p className="text-xl font-bold text-surface-900">{totalGrades}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GradesClassOverview;