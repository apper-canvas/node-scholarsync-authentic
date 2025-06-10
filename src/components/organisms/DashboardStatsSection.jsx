import React from 'react';
import StatCard from '@/components/molecules/StatCard';
import { motion } from 'framer-motion';

const DashboardStatsSection = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <StatCard
        title="Total Students"
        value={stats.totalStudents}
        icon="Users"
        color="primary"
        delay={0}
      />
      <StatCard
        title="Total Classes"
        value={stats.totalClasses}
        icon="BookOpen"
        color="secondary"
        delay={0.1}
      />
      <StatCard
        title="Today's Attendance"
        value={`${stats.todayAttendanceRate}%`}
        icon="Calendar"
        color="success"
        delay={0.2}
      />
      <StatCard
        title="Average Grade"
        value={`${stats.averageGrade}%`}
        icon="Award"
        color="accent"
        delay={0.3}
      />
    </motion.div>
  );
};

export default DashboardStatsSection;