import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import ScheduleClassItem from '@/components/molecules/ScheduleClassItem';

const ScheduleSection = ({ title, icon, scheduleItems, motionDelay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: motionDelay }}
      className="bg-white rounded-lg shadow-sm border border-surface-200"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Heading as="h2" className="text-lg font-semibold text-surface-900">
            {title}
          </Heading>
          <ApperIcon name={icon} className="w-5 h-5 text-surface-400" />
        </div>

        <div className="space-y-3">
          {scheduleItems.length === 0 ? (
            <p className="text-sm text-surface-500 italic">No schedule items for today.</p>
          ) : (
            scheduleItems.map((classItem, index) => (
              <ScheduleClassItem
                key={classItem.id}
                classItem={classItem}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduleSection;