import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import ApperIcon from '@/components/ApperIcon';
import StudentAvatar from '@/components/molecules/StudentAvatar';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const ClassRosterList = ({ filteredClasses, getClassStudents, getSubjectColor, motionDelay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: motionDelay }}
      className="space-y-4"
    >
      <Heading as="h2" className="text-xl font-semibold text-surface-900">
        Class Rosters
      </Heading>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClasses.map((classObj, index) => (
          <Card
            key={classObj.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <Heading as="h3" className="text-lg font-medium text-surface-900">
                  {classObj.name}
                </Heading>
                <div className="flex items-center space-x-4 mt-1">
                  <Badge className={getSubjectColor(classObj.subject)}>
                    {classObj.subject}
                  </Badge>
                  <Paragraph className="text-sm text-surface-500">
                    Period {classObj.period} • Room {classObj.room}
                  </Paragraph>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {getClassStudents(classObj).length}
                </p>
                <Paragraph className="text-xs text-surface-500">Students</Paragraph>
              </div>
            </div>

            <div className="space-y-2">
              <Heading as="h4" className="text-sm font-medium text-surface-700 mb-2">
                Enrolled Students
              </Heading>
              {getClassStudents(classObj).length === 0 ? (
                <Paragraph className="text-sm text-surface-500 italic">
                  No students enrolled
                </Paragraph>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {getClassStudents(classObj).map(student => (
                    <div
                      key={student.id}
                      className="flex items-center space-x-3 p-2 bg-surface-50 rounded-lg"
                    >
                      <StudentAvatar firstName={student.firstName} className="w-6 h-6" />
                      <div className="flex-1 min-w-0">
                        <Paragraph className="text-sm font-medium text-surface-900 truncate">
                          {student.firstName} {student.lastName}
                        </Paragraph>
                        <Paragraph className="text-xs text-surface-500">
                          Grade {student.grade}
                        </Paragraph>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-4 pt-4 border-t border-surface-200">
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-3 py-2 text-sm bg-primary text-white hover:bg-primary/90"
              >
                View Details
              </Button>
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 text-sm border border-surface-300 text-surface-700 hover:bg-surface-50"
              >
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default ClassRosterList;