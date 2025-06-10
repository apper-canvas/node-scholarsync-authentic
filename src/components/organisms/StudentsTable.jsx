import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import StudentAvatar from '@/components/molecules/StudentAvatar';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import EmptyStateDisplay from '@/components/organisms/EmptyStateDisplay';
import Paragraph from '@/components/atoms/Paragraph';

const StudentsTable = ({
  filteredStudents,
  searchTerm,
  setSearchTerm,
  gradeFilter,
  setGradeFilter,
  gradesAvailable,
  onDeleteStudent,
  studentsLength,
  setShowAddForm
}) => {
  return (
    &lt;&gt;
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200 p-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              <Input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
            </div>
          </div>
          <Select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-4 py-2"
          >
            <option value="">All Grades</option>
            {gradesAvailable.map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </Select>
        </div>
      </motion.div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <EmptyStateDisplay
          icon="Users"
          title="No students found"
          description={studentsLength === 0
            ? "Get started by adding your first student"
            : "Try adjusting your search or filter criteria"
          }
          actionButton={studentsLength === 0 ? { label: 'Add Student', onClick: () => setShowAddForm(true) } : null}
        />
      ) : (
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-surface-900">Student</th>
                  <th className="text-left py-3 px-6 font-medium text-surface-900">Grade</th>
                  <th className="text-left py-3 px-6 font-medium text-surface-900">Contact</th>
                  <th className="text-left py-3 px-6 font-medium text-surface-900">Parent Contact</th>
                  <th className="text-left py-3 px-6 font-medium text-surface-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="border-b border-surface-100 hover:bg-surface-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <StudentAvatar firstName={student.firstName} lastName={student.lastName} />
                        <div>
                          <Paragraph className="font-medium text-surface-900">
                            {student.firstName} {student.lastName}
                          </Paragraph>
                          <Paragraph className="text-sm text-surface-500">{student.email}</Paragraph>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className="bg-secondary/10 text-secondary">
                        Grade {student.grade}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-surface-600">{student.phone}</td>
                    <td className="py-4 px-6 text-surface-600">{student.parentContact}</td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <Button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-surface-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </Button>
                        <Button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-2 text-surface-600 hover:text-error hover:bg-error/10 rounded-lg transition-all duration-200"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    &lt;/>
  );
};

export default StudentsTable;