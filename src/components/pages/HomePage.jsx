import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { attendanceService, classService, studentService } from '@/services';

import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Card from '@/components/atoms/Card';
import QuickActionCard from '@/components/molecules/QuickActionCard';
import Button from '@/components/atoms/Button';
import LoadingOverlay from '@/components/organisms/LoadingOverlay';

const HomePage = () => {
  const navigate = useNavigate();
  const [quickStats, setQuickStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    todayAttendanceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuickStats = async () => {
      setLoading(true);
      try {
        const [students, classes, attendance] = await Promise.all([
          studentService.getAll(),
          classService.getAll(),
          attendanceService.getAll()
        ]);

        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendance.filter(record =>
          record.date.split('T')[0] === today
        );
        const presentToday = todayAttendance.filter(record =>
          record.status === 'present'
        ).length;
        const attendanceRate = todayAttendance.length > 0
          ? Math.round((presentToday / todayAttendance.length) * 100)
          : 0;

        setQuickStats({
          totalStudents: students.length,
          totalClasses: classes.length,
          todayAttendanceRate: attendanceRate
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
        // Optionally toast.error here if desired for home page errors
      } finally {
        setLoading(false);
      }
    };

    loadQuickStats();
  }, []);

  const quickActions = [
    {
      title: 'Mark Attendance',
      description: 'Record student attendance for today',
      icon: 'Calendar',
      color: 'text-accent bg-accent/10',
      action: () => navigate('/attendance')
    },
    {
      title: 'Enter Grades',
      description: 'Input assignment scores and feedback',
      icon: 'Award',
      color: 'text-success bg-success/10',
      action: () => navigate('/grades')
    },
    {
      title: 'View Students',
      description: 'Browse student roster and profiles',
      icon: 'Users',
      color: 'text-primary bg-primary/10',
      action: () => navigate('/students')
    },
    {
      title: 'Class Schedule',
      description: 'Check today\'s class timetable',
      icon: 'BookOpen',
      color: 'text-secondary bg-secondary/10',
      action: () => navigate('/classes')
    }
  ];

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Heading as="h1" className="text-3xl font-bold text-surface-900 mb-2">
          Welcome to ScholarSync
        </Heading>
        <Paragraph className="text-surface-600">
          Streamline your school management tasks with our comprehensive platform
        </Paragraph>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Paragraph className="text-sm font-medium text-surface-600 mb-1">Total Students</Paragraph>
              <p className="text-2xl font-bold text-surface-900">{quickStats.totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Paragraph className="text-sm font-medium text-surface-600 mb-1">Total Classes</Paragraph>
              <p className="text-2xl font-bold text-surface-900">{quickStats.totalClasses}</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Paragraph className="text-sm font-medium text-surface-600 mb-1">Today's Attendance</Paragraph>
              <p className="text-2xl font-bold text-surface-900">{quickStats.todayAttendanceRate}%</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="space-y-4"
      >
        <Heading as="h2" className="text-xl font-semibold text-surface-900">
          Quick Actions
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              color={action.color}
              action={action.action}
              delay={0.1 * index}
            />
          ))}
        </div>
      </motion.div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Heading as="h3" className="text-lg font-semibold mb-2 text-white">
              Complete Daily Tasks in 10 Minutes
            </Heading>
            <Paragraph className="text-white/90 mb-4">
              Start with the Dashboard to see today's priorities, then mark attendance and enter grades for all your classes.
            </Paragraph>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-primary hover:bg-surface-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Dashboard
            </Button>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center ml-6">
            <ApperIcon name="ArrowRight" className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;