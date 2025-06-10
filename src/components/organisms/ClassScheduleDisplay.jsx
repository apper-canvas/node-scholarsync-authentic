import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Select from '@/components/atoms/Select';
import ClassCard from '@/components/molecules/ClassCard';
import EmptyStateDisplay from '@/components/organisms/EmptyStateDisplay';
import Paragraph from '@/components/atoms/Paragraph';

const ClassScheduleDisplay = ({
  filteredClasses,
  selectedPeriod,
  setSelectedPeriod,
  periods,
  getClassStudents,
  getSubjectColor,
  classesLength,
  motionDelay
}) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: motionDelay }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <Heading as="h2" className="text-lg font-semibold text-surface-900">
          Today's Schedule
        </Heading>
        <Select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 w-auto"
        >
          <option value="">All Periods</option>
          {periods.map(period => (
            <option key={period} value={period}>Period {period}</option>
          ))}
        </Select>
      </div>

      {/* Time Grid */}
      {filteredClasses.length === 0 ? (
        <EmptyStateDisplay
          icon="BookOpen"
          title={selectedPeriod ? `No classes for period ${selectedPeriod}` : 'No classes found'}
          description={classesLength === 0
            ? "Get started by creating your first class"
            : "Try selecting a different period"
          }
          animateIcon={false}
          actionButton={classesLength === 0 ? { label: 'Create Class', onClick: () => console.log('Create Class')} : null}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredClasses.map((classObj, index) => (
            <ClassCard
              key={classObj.id}
              classObj={classObj}
              index={index}
              studentsCount={getClassStudents(classObj).length}
              getSubjectColor={getSubjectColor}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default ClassScheduleDisplay;