import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { attendanceService, classService, studentService } from '@/services';

import PageHeader from '@/components/organisms/PageHeader';
import LoadingOverlay from '@/components/organisms/LoadingOverlay';
import ErrorDisplayPage from '@/components/organisms/ErrorDisplayPage';
import AttendanceSummaryCards from '@/components/organisms/AttendanceSummaryCards';
import AttendanceSheetTable from '@/components/organisms/AttendanceSheetTable';
import EmptyStateDisplay from '@/components/organisms/EmptyStateDisplay';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';

const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      loadAttendanceData();
    }
  }, [selectedClass, selectedDate]);

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

  const loadAttendanceData = async () => {
    try {
      const data = await attendanceService.getAll();
      const filteredRecords = data.filter(record =>
        record.classId === selectedClass.id &&
        record.date.split('T')[0] === selectedDate
      );
      setAttendanceRecords(filteredRecords);
    } catch (error) {
      toast.error('Failed to load attendance data');
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      const existingRecord = attendanceRecords.find(
        record => record.studentId === studentId
      );

      if (existingRecord) {
        const updated = await attendanceService.update(existingRecord.id, {
          ...existingRecord,
          status
        });
        setAttendanceRecords(prev =>
          prev.map(record => record.id === updated.id ? updated : record)
        );
      } else {
        const newRecord = await attendanceService.create({
          studentId,
          classId: selectedClass.id,
          date: new Date(selectedDate + 'T08:00:00.000Z').toISOString(),
          status,
          notes: ''
        });
        setAttendanceRecords(prev => [...prev, newRecord]);
      }

      toast.success(`Attendance marked as ${status}`);
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const markAllPresent = async () => {
    const classStudents = getClassStudents();
    try {
      for (const student of classStudents) {
        await markAttendance(student.id, 'present');
      }
      toast.success('All students marked present');
    } catch (error) {
      toast.error('Failed to mark all present');
    }
  };

  const getClassStudents = () => {
    if (!selectedClass) return [];
    return students.filter(student =>
      selectedClass.studentIds?.includes(student.id)
    );
  };

  const getStudentAttendance = (studentId) => {
    return attendanceRecords.find(record => record.studentId === studentId);
  };

  const getAttendanceStats = () => {
    const classStudents = getClassStudents();
    const totalStudents = classStudents.length;
    const presentCount = attendanceRecords.filter(record => record.status === 'present').length;
    const absentCount = attendanceRecords.filter(record => record.status === 'absent').length;
    const lateCount = attendanceRecords.filter(record => record.status === 'late').length;
    const unmarked = totalStudents - attendanceRecords.length;

    return {
      total: totalStudents,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      unmarked,
      attendanceRate: totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0
    };
  };

  const stats = getAttendanceStats();

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return <ErrorDisplayPage message={error} onRetry={loadInitialData} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Track student attendance by class and date"
      >
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 w-auto"
        />
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
          <AttendanceSummaryCards stats={stats} motionDelay={0.1} />
          <AttendanceSheetTable
            selectedClass={selectedClass}
            selectedDate={selectedDate}
            classStudents={getClassStudents()}
            getStudentAttendance={getStudentAttendance}
            markAttendance={markAttendance}
            markAllPresent={markAllPresent}
            motionDelay={0.2}
          />
        </>
      ) : (
        <EmptyStateDisplay
          icon="Calendar"
          title="Select a class to begin"
          description="Choose a class from the dropdown above to start taking attendance"
        />
      )}
    </div>
  );
};

export default AttendancePage;