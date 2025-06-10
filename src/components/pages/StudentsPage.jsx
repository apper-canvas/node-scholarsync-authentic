import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { studentService } from '@/services';

import PageHeader from '@/components/organisms/PageHeader';
import LoadingOverlay from '@/components/organisms/LoadingOverlay';
import ErrorDisplayPage from '@/components/organisms/ErrorDisplayPage';
import AddStudentForm from '@/components/organisms/AddStudentForm';
import StudentsTable from '@/components/organisms/StudentsTable';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message || 'Failed to load students');
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (studentData) => {
    try {
      const newStudent = await studentService.create(studentData);
      setStudents(prev => [...prev, newStudent]);
      setShowAddForm(false);
      toast.success('Student added successfully');
    } catch (error) {
      toast.error('Failed to add student');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(id);
        setStudents(prev => prev.filter(student => student.id !== id));
        toast.success('Student deleted successfully');
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === '' || student.grade.toString() === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const grades = [...new Set(students.map(s => s.grade))].sort((a, b) => a - b);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return <ErrorDisplayPage message={error} onRetry={loadStudents} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Manage student roster and profiles"
        actionButton={{
          label: 'Add Student',
          onClick: () => setShowAddForm(true),
          icon: 'Plus'
        }}
      />

      <StudentsTable
        filteredStudents={filteredStudents}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        gradeFilter={gradeFilter}
        setGradeFilter={setGradeFilter}
        gradesAvailable={grades}
        onDeleteStudent={handleDeleteStudent}
        studentsLength={students.length}
        setShowAddForm={setShowAddForm}
      />

      <AnimatePresence>
        {showAddForm && (
          <AddStudentForm
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAddStudent}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentsPage;