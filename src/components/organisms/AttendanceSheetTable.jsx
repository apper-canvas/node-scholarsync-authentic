import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import ApperIcon from '@/components/ApperIcon';
import StudentAvatar from '@/components/molecules/StudentAvatar';
import Button from '@/components/atoms/Button';
import EmptyStateDisplay from '@/components/organisms/EmptyStateDisplay';

const AttendanceSheetTable = ({
  selectedClass,
  selectedDate,
  classStudents,
  getStudentAttendance,
  markAttendance,
  markAllPresent,
  motionDelay
}) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: motionDelay }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading as="h2" className="text-lg font-semibold text-surface-900">
            {selectedClass.name} - {new Date(selectedDate).toLocaleDateString()}
          </Heading>
          <Paragraph className="text-surface-600">
            Period {selectedClass.period} • Room {selectedClass.room}
          </Paragraph>
        </div>
        <Button
          onClick={markAllPresent}
          className="bg-success text-white hover:bg-success/90 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="CheckCircle" className="w-4 h-4" />
          <span>Mark All Present</span>
        </Button>
      </div>

      <div className="space-y-3">
        {classStudents.length === 0 ? (
          <EmptyStateDisplay
            icon="Users"
            title="No students enrolled in this class"
            description="Please enroll students to start taking attendance."
            animateIcon={false}
          />
        ) : (
          classStudents.map((student, index) => {
            const attendance = getStudentAttendance(student.id);
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <StudentAvatar firstName={student.firstName} lastName={student.lastName} />
                  <div>
                    <Paragraph className="font-medium text-surface-900">
                      {student.firstName} {student.lastName}
                    </Paragraph>
                    <Paragraph className="text-sm text-surface-500">Grade {student.grade}</Paragraph>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {['present', 'absent', 'late'].map((status) => (
                    <Button
                      key={status}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => markAttendance(student.id, status)}
                      className={`px-4 py-2 text-sm font-medium ${
                        attendance?.status === status
                          ? status === 'present'
                            ? 'bg-success text-white shadow-sm'
                            : status === 'absent'
                            ? 'bg-error text-white shadow-sm'
                            : 'bg-warning text-white shadow-sm'
                          : 'bg-white border border-surface-300 text-surface-600 hover:bg-surface-50'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default AttendanceSheetTable;