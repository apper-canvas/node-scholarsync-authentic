import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { classService, studentService } from '@/services';

import PageHeader from '@/components/organisms/PageHeader';
import LoadingOverlay from '@/components/organisms/LoadingOverlay';
import ErrorDisplayPage from '@/components/organisms/ErrorDisplayPage';
import ClassScheduleDisplay from '@/components/organisms/ClassScheduleDisplay';
import ClassRosterList from '@/components/organisms/ClassRosterList';
import Button from '@/components/atoms/Button';

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      setClasses(classesData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message || 'Failed to load classes');
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(cls =>
    selectedPeriod === '' || cls.period.toString() === selectedPeriod
  );

  const periods = [...new Set(classes.map(c => c.period))].sort((a, b) => a - b);

  const getClassStudents = (classObj) => {
    return students.filter(student =>
      classObj.studentIds?.includes(student.id)
    );
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-100 text-blue-800',
      'English': 'bg-green-100 text-green-800',
      'Science': 'bg-purple-100 text-purple-800',
      'History': 'bg-orange-100 text-orange-800',
      'Art': 'bg-pink-100 text-pink-800',
      'Physical Education': 'bg-red-100 text-red-800'
    };
    return colors[subject] || 'bg-surface-100 text-surface-800';
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return <ErrorDisplayPage message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        description="Manage class schedules and student rosters"
        actionButton={{
          label: 'Add Class',
          onClick: () => console.log('Add Class clicked'), // Placeholder, add actual modal
          icon: 'Plus'
        }}
      />

      <ClassScheduleDisplay
        filteredClasses={filteredClasses}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        periods={periods}
        getClassStudents={getClassStudents}
        getSubjectColor={getSubjectColor}
        classesLength={classes.length}
        motionDelay={0.1}
      />

      <ClassRosterList
        filteredClasses={filteredClasses}
        getClassStudents={getClassStudents}
        getSubjectColor={getSubjectColor}
        motionDelay={0.2}
      />
    </div>
  );
};

export default ClassesPage;