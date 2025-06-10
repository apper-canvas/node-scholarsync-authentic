import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';

const AddGradeForm = ({ classObj, students, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    assignmentName: '',
    score: '',
    maxScore: '100'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.assignmentName || !formData.score || !formData.maxScore) {
      toast.error('Please fill all fields');
      return;
    }

    onSubmit({
      ...formData,
      score: parseFloat(formData.score),
      maxScore: parseFloat(formData.maxScore)
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <Heading as="h3" className="text-lg font-semibold text-surface-900">
              Add Grade - {classObj.name}
            </Heading>
            <Button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5 text-surface-600" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Student"
              type="select"
              value={formData.studentId}
              onChange={(e) => handleChange('studentId', e.target.value)}
              required
              options={[
                { value: '', label: 'Select Student' },
                ...students.map(student => ({
                  value: student.id,
                  label: `${student.firstName} ${student.lastName}`
                }))
              ]}
            />

            <FormField
              label="Assignment Name"
              type="text"
              value={formData.assignmentName}
              onChange={(e) => handleChange('assignmentName', e.target.value)}
              placeholder="e.g., Math Quiz 1"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Score"
                type="number"
                value={formData.score}
                onChange={(e) => handleChange('score', e.target.value)}
                placeholder="85"
                min="0"
                step="0.1"
                required
              />

              <FormField
                label="Max Score"
                type="number"
                value={formData.maxScore}
                onChange={(e) => handleChange('maxScore', e.target.value)}
                placeholder="100"
                min="1"
                step="0.1"
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-primary text-white hover:bg-primary/90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Grade
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="border border-surface-300 text-surface-700 hover:bg-surface-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddGradeForm;