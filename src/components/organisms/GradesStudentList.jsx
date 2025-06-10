import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import ApperIcon from '@/components/ApperIcon';
import StudentAvatar from '@/components/molecules/StudentAvatar';
import Button from '@/components/atoms/Button';

const GradesStudentList = ({ classStudents, getStudentGrades, getStudentAverage, getLetterGrade, onDeleteGrade, motionDelay }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: motionDelay }}
      className="p-6"
    >
      <Heading as="h3" className="text-lg font-semibold text-surface-900 mb-4">
        Student Grades
      </Heading>

      <div className="space-y-4">
        {classStudents.map((student, index) => {
          const studentGrades = getStudentGrades(student.id);
          const average = getStudentAverage(student.id);
          const percentage = average !== 'N/A' ? parseInt(average) : 0;

          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="border border-surface-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <StudentAvatar firstName={student.firstName} lastName={student.lastName} />
                  <div>
                    <Paragraph className="font-medium text-surface-900">
                      {student.firstName} {student.lastName}
                    </Paragraph>
                    <Paragraph className="text-sm text-surface-500">Grade {student.grade}</Paragraph>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{average}</p>
                  <Paragraph className="text-sm text-surface-500">
                    {average !== 'N/A' && getLetterGrade(percentage)}
                  </Paragraph>
                </div>
              </div>

              {studentGrades.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {studentGrades.map(grade => (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
                    >
                      <div>
                        <Paragraph className="text-sm font-medium text-surface-900">
                          {grade.assignmentName}
                        </Paragraph>
                        <Paragraph className="text-xs text-surface-500">
                          {new Date(grade.date).toLocaleDateString()}
                        </Paragraph>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {grade.score}/{grade.maxScore}
                        </span>
                        <Button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDeleteGrade(grade.id)}
                          className="p-1 text-surface-400 hover:text-error transition-colors duration-200"
                        >
                          <ApperIcon name="Trash2" className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Paragraph className="text-sm text-surface-500 italic">No grades recorded</Paragraph>
              )}
            </motion.div>
          );
        })}
      </div>

      {classStudents.length === 0 && (
        <EmptyStateDisplay
          icon="Users"
          title="No students enrolled in this class"
          description="Please enroll students to start managing their grades."
          animateIcon={false}
        />
      )}
    </Card>
  );
};

export default GradesStudentList;