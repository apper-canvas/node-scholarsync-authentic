import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { gradeService, classService, studentService } from '@/services';

import PageHeader from '@/components/organisms/PageHeader';
import LoadingOverlay from '@/components/organisms/LoadingOverlay';
import ErrorDisplayPage from '@/components/organisms/ErrorDisplayPage';
import EmptyStateDisplay from '@/components/organisms/EmptyStateDisplay';
import AddGradeForm from '@/components/organisms/AddGradeForm';
import GradesClassOverview from '@/components/organisms/GradesClassOverview';
import GradesStudentList from '@/components/organisms/GradesStudentList';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const GradesPage = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadGrades();
    }
  }, [selectedClass]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      setClasses(classesData);
      setStudents(studentsData);

      if (classesData.length > 0) {
        setSelectedClass(classesData[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadGrades = async () => {
    try {
      const data = await gradeService.getAll();
      const classGrades = data.filter(grade => grade.classId === selectedClass.id);
      setGrades(classGrades);
    } catch (error) {
      toast.error('Failed to load grades');
    }
  };

  const handleAddGrade = async (gradeData) => {
    try {
      const newGrade = await gradeService.create({
        ...gradeData,
        classId: selectedClass.id,
        date: new Date().toISOString()
      });
      setGrades(prev => [...prev, newGrade]);
      setShowAddForm(false);
      toast.success('Grade added successfully');
    } catch (error) {
      toast.error('Failed to add grade');
    }
  };

  const handleDeleteGrade = async (id) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await gradeService.delete(id);
        setGrades(prev => prev.filter(grade => grade.id !== id));
        toast.success('Grade deleted successfully');
      } catch (error) {
        toast.error('Failed to delete grade');
      }
    }
  };

  const getClassStudents = () => {
    if (!selectedClass) return [];
    return students.filter(student =>
      selectedClass.studentIds?.includes(student.id)
    );
  };

  const getStudentGrades = (studentId) => {
    return grades.filter(grade => grade.studentId === studentId);
  };

  const getStudentAverage = (studentId) => {
    const studentGrades = getStudentGrades(studentId);
    if (studentGrades.length === 0) return 'N/A';

    const average = studentGrades.reduce((sum, grade) =>
      sum + (grade.score / grade.maxScore), 0
    ) / studentGrades.length;

    return Math.round(average * 100) + '%';
  };

  const getClassAverage = () => {
    const classStudents = getClassStudents();
    if (classStudents.length === 0) return 'N/A';

    const totalAverage = classStudents.reduce((sum, student) => {
      const studentGrades = getStudentGrades(student.id);
      if (studentGrades.length === 0) return sum;

      const studentAverage = studentGrades.reduce((gradeSum, grade) =>
        gradeSum + (grade.score / grade.maxScore), 0
      ) / studentGrades.length;

      return sum + studentAverage;
    }, 0);

    return Math.round((totalAverage / classStudents.length) * 100) + '%';
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const assignmentsCount = [...new Set(grades.map(g => g.assignmentName))].length;

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return <ErrorDisplayPage message={error} onRetry={loadInitialData} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grades"
        description="Manage student grades and assignments"
        actionButton={{
          label: 'Add Grade',
          onClick: () => setShowAddForm(true),
          disabled: !selectedClass,
          icon: 'Plus'
        }}
      >
        <Select
          value={selectedClass?.id || ''}
          onChange={(e) => {
            const classObj = classes.find(c => c.id === e.target.value);
            setSelectedClass(classObj);
          }}
          className="px-4 py-2 w-auto"
        >
          <option value="">Select Class</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name} - Period {cls.period}
            </option>
          ))}
        </Select>
      </PageHeader>

      {selectedClass ? (
        <>
          <GradesClassOverview
            selectedClass={selectedClass}
            classStudentsCount={getClassStudents().length}
            assignmentsCount={assignmentsCount}
            totalGrades={grades.length}
            classAverage={getClassAverage()}
            motionDelay={0.1}
          />
          <GradesStudentList
            classStudents={getClassStudents()}
            getStudentGrades={getStudentGrades}
            getStudentAverage={getStudentAverage}
            getLetterGrade={getLetterGrade}
            onDeleteGrade={handleDeleteGrade}
            motionDelay={0.2}
          />
        </>
      ) : (
        <EmptyStateDisplay
          icon="Award"
          title="Select a class to begin"
          description="Choose a class from the dropdown above to start managing grades"
        />
      )}

      <AnimatePresence>
        {showAddForm && selectedClass && (
          <AddGradeForm
            classObj={selectedClass}
            students={getClassStudents()}
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAddGrade}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GradesPage;