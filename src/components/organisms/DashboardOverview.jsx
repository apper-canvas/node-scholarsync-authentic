import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { studentService, classService, attendanceService, gradeService, announcementService } from '@/services';

import PageHeader from '@/components/organisms/PageHeader';
import DashboardStatsSection from '@/components/organisms/DashboardStatsSection';
import ScheduleSection from '@/components/organisms/ScheduleSection';
import RecentAnnouncementsList from '@/components/organisms/RecentAnnouncementsList';
import QuickActionsSection from '@/components/organisms/QuickActionsSection';
import LoadingOverlay from '@/components/organisms/LoadingOverlay';
import ErrorDisplayPage from '@/components/organisms/ErrorDisplayPage';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    todayAttendanceRate: 0,
    averageGrade: 0
  });
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [students, classes, attendance, grades, announcements] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll(),
        announcementService.getAll()
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

      const totalScore = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore), 0);
      const averageGrade = grades.length > 0
        ? Math.round((totalScore / grades.length) * 100)
        : 0;

      setStats({
        totalStudents: students.length,
        totalClasses: classes.length,
        todayAttendanceRate: attendanceRate,
        averageGrade
      });

      setTodaysSchedule(classes.slice(0, 4));
      setRecentAnnouncements(announcements.slice(0, 3));
    } catch (error) {
      setError(error.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return <ErrorDisplayPage message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your school management activities"
      />

      <DashboardStatsSection stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScheduleSection
          title="Today's Schedule"
          icon="Clock"
          scheduleItems={todaysSchedule}
          motionDelay={0.2}
        />
        <RecentAnnouncementsList
          announcements={recentAnnouncements}
          motionDelay={0.3}
        />
      </div>

      <QuickActionsSection motionDelay={0.4} />
    </div>
  );
};

export default DashboardOverview;